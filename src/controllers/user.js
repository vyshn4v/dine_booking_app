const { sample } = require('../sampledata/sample')
// sample=JSON.parse(sample)

//data base schemas
const User = require('../models/user')
const user = require('../models/user')

//
const bcrypt = require('bcrypt')
const SALT_ROUND = require('../config/bcrypt')
//pages
const pages = {
    USER_HOME_PAGE: "user/home",
    ORDER_PAGE: "user/order",
    RESTAURANT_PAGE: "user/restaurantPage",
    AVAILABLE_FOODS: "user/availableFoods",
    PAYMENT_DETAILS_PAGE: "user/paymentDetails",
    WISHLIST_PAGE: "user/wishList",
    LOGIN_PAGE: "user/login",
    SIGNUP_PAGE: "user/signup",
    PROFILE_PAGE: "user/profile",
    SEARCH_PRODUCTS: "user/searchRestaurant",
    CHANGE_PASSWORD: "user/changePassword",
    OTP_VERIFICATION: "user/otpVerification"
}

///GET - Home page
const homePage = (req, res) => {
    res.render(pages.USER_HOME_PAGE, { userHeader: true, title: "home", restaurants: sample })
}
///GET - Order Page
const orderPage = (req, res) => {
    let total = 0;
    sample.map((data) => {
        total += data.price
    })
    res.render(pages.ORDER_PAGE, { userHeader: true, title: "orders", cart: sample, total })
}

const restaurantPage = (req, res) => {
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.RESTAURANT_PAGE, { userHeader: true, title: "restaurant", restaurant })
}

const availableFood = (req, res) => {
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.AVAILABLE_FOODS, { userHeader: true, title: "avaialble foods", restaurant })
}

const paymentDetails = (req, res) => {
    console.log(req.body);
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.PAYMENT_DETAILS_PAGE, { userHeader: true, title: "payment details", restaurant })
}

const wishList = (req, res) => {
    res.render(pages.WISHLIST_PAGE, { userHeader: true, title: "wishlist", cart: sample })
}

const getLogin = (req, res) => {
    res.render(pages.LOGIN_PAGE, { userHeader: true, title: "user login", })
}
const postLogin = (req, res) => {
    try {
        console.log(req.body);
        user.findOne({ email: req.body.email }).then((user) => {
            bcrypt.compare( req.body.password,user.password).then((status) => {
                if (status) {
                    res.redirect('/')
                }
                else {
                    res.redirect('/user_login')
                }
            })
        })
    } catch (err) {
        console.log(err);
    }

}
const getSignup = (req, res) => {
    res.render(pages.SIGNUP_PAGE, { userHeader: true, title: "user signup", })
}
const postSignup = (req, res) => {
    try {
        const { confirm_password, ...rest } = req.body
        bcrypt.hash(req.body?.password, SALT_ROUND).then((hashedPassword) => {
            rest.password = hashedPassword
            const user = new User(rest)
            user.save()
        })
    } catch (err) {
        console.log(err);
    }
    res.render(pages.SIGNUP_PAGE, { userHeader: true, title: "user signup", })
}


const profile = (req, res) => {
    res.render(pages.PROFILE_PAGE, { userHeader: true, title: "Profile", })
}
const searchProducts = (req, res) => {
    res.render(pages.SEARCH_PRODUCTS, { restaurants: sample })
}
const changePassword = (req, res) => {
    res.render(pages.CHANGE_PASSWORD, { userHeader: true, title: "Change password", restaurants: sample })
}
const otpVerification = (req, res) => {
    res.render(pages.OTP_VERIFICATION, { userHeader: true, title: "OTP verification", })
}

module.exports = {
    homePage,
    orderPage,
    restaurantPage,
    availableFood,
    paymentDetails,
    wishList,
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    profile,
    searchProducts,
    changePassword,
    otpVerification
}