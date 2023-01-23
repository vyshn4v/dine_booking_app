const { homePage, orderPage, restaurantPage, availableFood, paymentDetails, wishList, login, signup, profile, searchProducts, changePassword, otpVerification, getLogin, postLogin, getSignup, postSignup } = require('../controllers/user')

const router = require('express').Router()

router.get('/', homePage)

router.get('/user_order', orderPage)

router.get("/restaurant_details/:restaurant_id", restaurantPage)

router.get("/restaurant_details/:restaurant_id/available_foods", availableFood)

router.get("/order_items/:restaurant_id", paymentDetails)

router.get("/wishlist", wishList)
//user login
router.get("/user_login", getLogin)
router.post("/user_login", postLogin)


//user signup
router.get("/user_signup", getSignup)
router.post("/user_signup", postSignup)

router.get("/user_profile", profile)

router.get("/search_products", searchProducts)

router.get("/change_password", changePassword)

router.get("/otp_verification", otpVerification)

module.exports = router