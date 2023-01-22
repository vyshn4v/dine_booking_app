const { homePage, orderPage, restaurantPage, availableFood, paymentDetails, wishList, login, signup, profile, searchProducts, changePassword, otpVerification } = require('../controllers/userControllers')

const router = require('express').Router()

router.get('/', homePage)

router.get('/user_order', orderPage)

router.get("/restaurant/:restaurant_id", restaurantPage)

router.get("/restaurant/:restaurant_id/available_foods", availableFood)

router.get("/order_items/:restaurant_id", paymentDetails)

router.get("/wishlist", wishList)

router.get("/user_login", login)

router.get("/user_signup", signup)

router.get("/user_profile", profile)

router.get("/search_products", searchProducts)

router.get("/change_password", changePassword)

router.get("/otp_verification", otpVerification)

module.exports = router