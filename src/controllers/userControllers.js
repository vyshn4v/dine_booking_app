const { sample } = require('../sampledata/sample')
// sample=JSON.parse(sample)
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
    OTP_VERIFICATION:"user/otpVerification"
}

///GET - Home page
const homePage = (req, res) => {
    res.render(pages.USER_HOME_PAGE, { title: "home", restaurants: sample })
}
///GET - Order Page
const orderPage = (req, res) => {
    let total = 0;
    sample.map((data) => {
        total += data.price
    })
    res.render(pages.ORDER_PAGE, { title: "orders", cart: sample, total })
}

const restaurantPage = (req, res) => {
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.RESTAURANT_PAGE, {title:"restaurant", restaurant })
}

const availableFood = (req, res) => {
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.AVAILABLE_FOODS, {title:"avaialble foods", restaurant })
}

const paymentDetails = (req, res) => {
    console.log(req.body);
    let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
    res.render(pages.PAYMENT_DETAILS_PAGE, {title:"payment details", restaurant })
}

const wishList = (req, res) => {
    res.render(pages.WISHLIST_PAGE, {title:"wishlist", cart: sample })
}

const login = (req, res) => {
    res.render(pages.LOGIN_PAGE,{title:"user login",})
}
const signup = (req, res) => {
    res.render(pages.SIGNUP_PAGE,{title:"user signup",})
}
const profile = (req, res) => {
    res.render(pages.PROFILE_PAGE,{title:"Profile",})
}
const searchProducts = (req, res) => {
    res.render(pages.SEARCH_PRODUCTS, { restaurants: sample })
}
const changePassword = (req, res) => {
    res.render(pages.CHANGE_PASSWORD, {title:"Change password", restaurants: sample })
}
const otpVerification = (req, res) => {
    res.render(pages.OTP_VERIFICATION,{title:"OTP verification",})
}

module.exports = {
    homePage,
    orderPage,
    restaurantPage,
    availableFood,
    paymentDetails,
    wishList,
    login,
    signup,
    profile,
    searchProducts,
    changePassword,
    otpVerification
}