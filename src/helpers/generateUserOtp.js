const sendOtpViaMail = require("./sendOtpMail")
const bcrypt = require('bcrypt');
const user = require("../models/user");
const generateUserOtp = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const OTP = `${Math.floor((1000 + Math.random() * 9000))}`
            const hashedOtp = await bcrypt.hash(OTP, Number(process.env.SALT_ROUND))
            user.findByIdAndUpdate({ _id: userId }, { $set: { "otp.expiredAt": new Date((Date.now() + Number(process.env.OTP_EXPIRE_TIME))), "otp.otp": hashedOtp } }, { new: true }).then((userData) => {
                resolve({ ...userData._doc, OTP })
            }).catch(() => {
                reject(err)
            })
        } catch (err) {
            reject(err)
        }
    })
}
module.exports = generateUserOtp