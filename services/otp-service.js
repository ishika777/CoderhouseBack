const crypto = require("crypto");
const HashService = require("../services/hash-service");


const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
// const twilio = require("twilio")(smsSid, smsAuthToken, {
//     lazyLoading : true
// })

class OtpService{
    generateOtp = async () => {
        const otp = crypto.randomInt(1000, 9999);
        return otp
    }

    // sendBySms = async (phone , otp) => {
    //     return await twilio.messages.create({
    //         to : phone,
    //         from : process.env.SMS_FROM_NUMBER,
    //         body : `Your codershouse OTP is ${otp}`,
    //     })
    // }

    verifyOtp = (hashedOtp, data) => {
        let computedHash = HashService.hashOtp(data);
        if(computedHash === hashedOtp){
            return true;
        }
        return false;
    }
}

module.exports = new OtpService();