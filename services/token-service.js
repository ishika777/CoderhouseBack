const jwt = require("jsonwebtoken");
const Refresh = require("../models/refresh-model")

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService{
    generateTokens = (payload) => {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            // expiresIn : "1m"
            expiresIn : "1m"
        })

        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn : "1y"
        })

        return {accessToken, refreshToken}
    }

    storeRefreshToken = async (token , userId) => {
        try {
            await Refresh.create({
                token,
                userId
            })
        } catch (error) {
            console.log(error)
        }
    }

    verifyAccessToken = async (token) => {
        return jwt.verify(token, accessTokenSecret);
    }

    verifyRefreshToken = async (refreshToken) => {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    findRefreshToken = async (userId, refreshToken) => {
        return await Refresh.findOne({
            token : refreshToken,
            userId : userId
        })
    }

    updateRefreshToken = async(userId, refreshToken) => {
        return await Refresh.updateOne({userId : userId}, {token : refreshToken});
    }

    removeToken = async (refreshToken) => {
        return await Refresh.deleteOne({token : refreshToken})
    }
}


module.exports = new TokenService();