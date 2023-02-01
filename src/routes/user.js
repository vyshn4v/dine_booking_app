const { getLogin, postLogin, getTwoFactor } = require('../controllers/Auth')
const userController = require('../controllers/user')
const { userSessionManagement, userNotLogin } = require('../middlewares/session/user')

const router = require('express').Router()

router.get('/', userSessionManagement, userController.homePageGet)

router.get('/orders', userSessionManagement, userController.orderPageGet)
router.get('/tables/:restaurant_id', userController.tablesPageGet)
router.post('/book-table', userController.bookTablePost)

router.get("/restaurant-details/:restaurant_id", userSessionManagement, userController.restaurantPageGet)

router.get("/restaurant-details/:restaurant_id/available-foods", userSessionManagement, userController.availableFoodGet)

router.get("/ordered-items/:restaurant_id", userSessionManagement, userController.paymentDetailsGet)

router.get("/wishlist", userSessionManagement, userController.wishListGet)
//user login
router.get("/login", userNotLogin, getLogin)
router.post("/login", userNotLogin, postLogin)


//user signup
router.get("/signup", userNotLogin, userController.signupGet)
router.post("/signup", userNotLogin, userController.signupPost)

router.get("/profile", userSessionManagement, userController.profileGet)

router.get("/search-products", userController.searchProductsGet)

router.get("/change-password", userSessionManagement, userController.ChangePasswordGet)

//validate otp
router.get("/:user_id/validate-otp", userController.otpVerificationGet)
router.post("/:user_id/validate-otp", userController.otpVerificationPost)

// forgot password
router.get('/forgot-password', userController.ForgotPasswordGet)
router.get('/change-password/:user_id', userController.changePasswordGet)
router.post('/change-password/:user_id', userController.changePasswordPost)
router.post('/verify-forgot-password', userController.verifyuserOtpPost)
router.post('/:user_email/send-otp/:validation_type', userController.sendOtpEmailPost)

//validate otp verfication
router.get('/:user_id/validate-otp/2-factor', getTwoFactor)
router.post('/:user_id/validate-otp/2-factor',)

module.exports = router