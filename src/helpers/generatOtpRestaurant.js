const restaurant = require("../models/restaurant")
const sendOtpViaMail = require("./sendOtpMail")
const bcrypt = require('bcrypt');
const SALT_ROUND = require("../config/bcrypt");
const generateRestaurantOtp = (restaurantId) => {
    console.log(restaurantId);
    return new Promise(async (resolve, reject) => {
        try {
            const OTP = `${Math.floor((1000 + Math.random() * 9000))}`
            const hashedOtp = await bcrypt.hash(OTP, SALT_ROUND)
            restaurant.findByIdAndUpdate({ _id: restaurantId }, { $set: { "otp.expiredAt": new Date((Date.now() + 360000)), "otp.otp": hashedOtp, } }, { new: true }).then((restaurant) => {
                sendOtpViaMail(OTP, restaurant.email).then((status) => {
                    resolve(status)
                }).catch(() => {
                    reject()
                })
            }).catch(() => {
                reject(false)
            })
        } catch (err) {
            reject(false)
        }

    })
}

module.exports = generateRestaurantOtp