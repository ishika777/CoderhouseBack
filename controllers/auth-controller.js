const OtpService = require("../services/otp-service")
const HashService = require("../services/hash-service");
const UserService = require("../services/user-service");
const TokenService = require("../services/token-service")
const User = require("../models/user-model")
const Refresh = require("../models/refresh-model")
const UserDto = require("../dto/user-dto");
const mongoose = require("mongoose")

class AuthController{

    sendOtpEmail = async (req, res) => {

        const {email} = req.body;
        if(!email){
            return res.status(400).json({message : "Email field is required"})
        }

        //generate otp
        const otp = await OtpService.generateOtp();

        //hash otp
        const timeToLeave = 1000 * 60 * 2; //2 minutes
        const expires = Date.now() + timeToLeave;
        const data = `${email}.${otp}.${expires}`;
        const hash = HashService.hashOtp(data);


        try {
            // await otpService.sendBySms(phone, otp);
            return res.json({
                hash : `${hash}.${expires}`,
                email,
                otp
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "Message Sending failed"})
        }

    }

    sendOtpPhone = async (req, res) => {

        const {phone} = req.body;
        if(!phone){
            return res.status(400).json({message : "Phone field is required"})
        }

        //generate otp
        const otp = await OtpService.generateOtp();

        //hash otp
        const timeToLeave = 1000 * 60 * 2; //2 minutes
        const expires = Date.now() + timeToLeave;
        const data = `${phone}.${otp}.${expires}`;
        const hash = HashService.hashOtp(data);


        try {
            // await otpService.sendBySms(phone, otp);
            return res.json({
                hash : `${hash}.${expires}`,
                phone,
                otp
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "Message Sending failed"})
        }

    }

    verifyOtp = async (req, res) => {

        const {otp, hash, field} = req.body;
        if(!otp || !hash || !field){
            return res.status(400).json({message : "All fields are requires"});
        }

        const [hashedOtp, expires] = hash.split(".")

        if(Date.now() > +expires){
            return res.status(400).json({message : "OTP expired"})
        }

        const data = `${field}.${otp}.${expires}`;

        const isValid = OtpService.verifyOtp(hashedOtp, data);
        if(!isValid){
            console.log("hi")
            return res.status(400).json({message : "Invalid OTP"})
        }

        let user;
        try {
            user = await UserService.findUser({field})
            if(!user){
                user = await UserService.createUser({field})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "db error"})
        }

        const {accessToken, refreshToken} = TokenService.generateTokens({_id : user._id, activated : false});

        await TokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie("refreshToken", refreshToken, {
            maxAge : 30 * 24 * 60 * 60 * 1000,  //30 days
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
        })

        res.cookie("accessToken", accessToken, {
            maxAge : 30 * 24 * 60 * 60 * 1000,  //30
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
        })
        
        const userDto = new UserDto(user);
        res.json({user : userDto, auth : true})
    }

    refresh = async (req, res) => {

        //get refresh token from cookie
        const {refreshToken : refreshTokenFromCookie} = req.cookies;


        //check if token is valid
        let userData;
        try {
            userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie)
        } catch (error) {
            return res.status(401).json({message : "Invalid Token"})
        }

        //check if token is in db
        try {
            const token = await TokenService.findRefreshToken(userData._id, refreshTokenFromCookie)
            if(!token){
                return res.status(401).json({message : "Invalid Token"})
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "Internal Error1"})
        }

        //check if valid user
        const user = await UserService.findUser({_id : userData._id})
        if(!user){
            return res.status(404).json({message : "No User"})
        }

        //generate new tokens
        const {refreshToken, accessToken} = TokenService.generateTokens({_id : userData._id})

        //update refresh token
        try {
            await TokenService.updateRefreshToken(userData._id, refreshToken)

        } catch (error) {
            return res.status(500).json({message : "Internal Error"})
        }


        //put in cookie
        res.cookie("refreshToken", refreshToken, {
            maxAge : 30 * 24 * 60 * 60 * 1000,  //30 days
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
        })

        res.cookie("accessToken", accessToken, {
            maxAge : 30 * 24 * 60 * 60 * 1000,  //30
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
        })

        //response
        const userDto = new UserDto(user);
        res.json({user : userDto, auth : true})


    }

    logout = async (req, res) => {

        const {refreshToken} = req.cookies;

        //delete refresh token from db
        await TokenService.removeToken(refreshToken)

        //delete cookies
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" })
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "Strict" })
        res.json({user : null, auth : false})
    }



}


module.exports = new AuthController();
