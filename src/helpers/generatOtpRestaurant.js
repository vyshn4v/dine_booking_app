const restaurant = require("../models/restaurant")
const bcrypt = require('bcrypt');
const SALT_ROUND = require("../config/bcrypt");
const generateRestaurantOtp = (restaurantId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const OTP = `${Math.floor((1000 + Math.random() * 9000))}`
            const hashedOtp = await bcrypt.hash(OTP, SALT_ROUND)
            restaurant.findByIdAndUpdate({ _id: restaurantId }, { $set: { "otp.expiredAt": new Date((Date.now() + Number(process.env.OTP_EXPIRE_TIME))), "otp.otp": hashedOtp, } }, { new: true }).then((restaurant) => {
                resolve({ ...restaurant._doc, OTP })
            }).catch(() => {
                throw "otp not generated"
            })
        } catch (err) {
            reject(err)
        }

    })
}

module.exports = generateRestaurantOtp