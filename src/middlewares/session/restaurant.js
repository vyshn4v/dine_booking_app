// const otpTextGenerator = require("../../helpers/generateOtpText")
// const generateRestaurantOtp = require("../../helpers/generatOtpRestaurant")
// const sendOtpViaMail = require("../../helpers/sendOtpMail")
const restaurant = require("../../models/restaurant")
//check restaurant is logged in
const restaurantSessionManagement = (req, res, next) => {
    if (req.session?.restaurant) {
        next()//if logged in next 
    } else {
        res.redirect("/restaurant/login") //other wise redirect
    }
}
const restaurantAuthManagement = (req, res, next) => {
    if (req.session?.restaurant) {
        res.redirect("/restaurant/view-orders")
    } else {
        next()
    }
}




const validateUserAlreadySignup = (req, res, next) => {
    try {
        restaurant.findOne({ email: req.body.email }).then((restaurant) => {
            console.log(restaurant);
            if (req.body.email === restaurant?.email) {
                req.session.err = "email already taken"
                res.redirect('/restaurant/signup')
            } else {
                next()
            }
        }).catch((err) => {
            throw err
        })
    } catch (err) {
        req.session.err = "email already taken"
        res.redirect('/restaurant/signup')
    }
}

module.exports = {
    restaurantSessionManagement,
    validateUserAlreadySignup,
    restaurantAuthManagement
}