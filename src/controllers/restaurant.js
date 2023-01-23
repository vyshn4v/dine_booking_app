const restaurant = require("../models/restaurant")
const bcrypt = require('bcrypt')
const SALT_ROUND = require("../config/bcrypt")

const sendOtpViaMail = require("../helpers/sendOtpMail");
const generateRestaurantOtp = require("../helpers/generatOtpRestaurant");

const viewOrders = (req, res) => {
    res.render("restaurant/orders", { restaurantHeader: true, title: "orders", cart: sample })
}

const getRestaurantLogin = (req, res) => {
    res.render("restaurant/login", { restaurantHeader: true })
}
const postRestaurantLogin = (req, res) => {
    try {
        console.log(req.body);
        restaurant.findOne({ email: req.body.email }).then((restaurant) => {
            bcrypt.compare(req.body.password, restaurant.password).then((status) => {
                console.log(status);
                if (status) {
                    res.redirect('/restaurant/view_orders')
                }
                else {
                    res.redirect('/restaurant/restaurant_login')
                }
            })
        })
    } catch (err) {
        console.log(err);
    }
}
const getRestaurantsignup = (req, res) => {
    res.render("restaurant/signup", { restaurantHeader: true })
}
const postRestaurantsignup = async (req, res) => {
    console.log(req.body);
    try {
        const { confirm_password, ...rest } = req.body
        rest.password = await bcrypt.hash(req.body.password, SALT_ROUND)
        const Restaurant = new restaurant(rest)
        const savedRestaurant = await Restaurant.save()
        generateRestaurantOtp(savedRestaurant._id).then((status) => {
            res.redirect(`${savedRestaurant._id}/validate_otp`)
        }).catch(() => {
            console.log("err1");
        })
    } catch (err) {
        console.log(err);
    }
}
// Get render otp validation page
const getOtpPage = async (req, res) => {
    res.render("restaurant/otpValidation")
}
const postOtpPage = async (req, res) => {
    try {
        restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
            let expired = new Date(restaurantData.otp.expiredAt)
            let currentDate = new Date();
            console.log(req.body);
            bcrypt.compare(req.body.otp, restaurantData.otp.otp).then((status) => {
                if (status && expired > currentDate) {
                    restaurant.findByIdAndUpdate({ _id: restaurantData._id }, { $set: { "verified": true, "otp.otp": "" } }, { new: true }).then((restaurantnew) => {
                        res.redirect('/')
                    })
                } else {
                    res.redirect(`../${req.params.restaurant_id}/validate_otp`)
                }
            })
        })
    } catch (err) {
        console.log(err);
    }
}

const validateOtp = (req, res) => {
    console.log(req.body);
    restaurant.findById
}

const viewProducts = (req, res) => {
    let users = [{

    }, {}, {}, {}, {}]
    res.render("restaurant/products", { restaurantHeader: true, users })
}
const showProfile = (req, res) => {
    let users = [{

    }, {}, {}, {}, {}]
    res.render("restaurant/profile", { restaurantHeader: true, users })
}
const addProduct = (req, res) => {
    let users = [{

    }, {}, {}, {}, {}]
    res.render("restaurant/addProduct", { restaurantHeader: true, users })
}

const signup = (req, res) => {
    let users = [{

    }, {}, {}, {}]
    res.render("restaurant/login", { restaurantHeader: true, users })
}

module.exports = {
    signup,
    viewProducts,
    showProfile,
    getRestaurantsignup,
    postRestaurantsignup,
    addProduct,
    getOtpPage,
    validateOtp,
    postOtpPage,
    viewOrders, getRestaurantLogin, postRestaurantLogin
}