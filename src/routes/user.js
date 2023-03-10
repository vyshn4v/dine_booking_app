const { getLogin, postLogin, getTwoFactor, getLoginWithOtp, postLoginWithOtp, postTwoFactor, userLogout } = require('../controllers/Auth')
const userController = require('../controllers/user')
const { userSessionManagement, userNotLogin } = require('../middlewares/session/user')
const { multer } = require('../helpers/imagepload')
const router = require('express').Router()

router.get('/', userSessionManagement, userController.homePageGet)
router.get('/search', userSessionManagement, userController.searchGet)
router.get('/:restaurant_id/buy-products', userSessionManagement, userController.buyProductGet)

router.get('/tables/:restaurant_id', userController.tablesPageGet)
router.post('/book-table', userController.bookTablePost)

router.post('/update-review', userSessionManagement, userController.updateReview)

router.get("/restaurant-details/:restaurant_id", userSessionManagement, userController.restaurantPageGet)

router.get("/restaurant-details/:restaurant_id/available-foods", userSessionManagement, userController.availableFoodGet)

router.get("/ordered-items/:restaurant_id", userSessionManagement, userController.paymentDetailsGet)

router.get("/wishlist", userSessionManagement, userController.wishListGet)
router.get("/whishlist/:wishlist_id/:product_id/remove", userSessionManagement, userController.removeFromWhishListPost)
router.get("/add-to-wishlist/:product_id", userSessionManagement, userController.wishListPost)
router.post("/check-out/:restaurant_id", userSessionManagement, userController.checkOutGet)
router.post("/update-product/:restaurant_id", userSessionManagement, userController.selectedItemsPost)
router.get("/select-tables/:restaurant_id", userSessionManagement, userController.selectTablesGet)

//user login
router.get("/login", userNotLogin, getLogin)
router.post("/login", userNotLogin, postLogin)
router.get("/login-with-otp", userNotLogin, getLoginWithOtp)
router.post("/login-with-otp", userNotLogin, postLoginWithOtp)

//user signup
router.get("/signup", userController.signupGet)
router.post("/signup", userNotLogin, userController.signupPost)

router.get("/profile", userSessionManagement, userController.profileGet)
router.post("/update-profile/:user_id", userSessionManagement,  multer.single('profile_pic'),userController.profilePost)

router.get("/search-products", userController.searchProductsGet)

router.get("/change-password", userSessionManagement, userController.ChangePasswordGet)

router.get("/table-details/:restaurant_id/:table_id", userSessionManagement, userController.tableDetailsget)

//validate otp
router.get("/:user_id/validate-otp", userController.otpVerificationGet)
router.post("/:user_id/validate-otp", userController.otpVerificationPost)

//order
router.get('/orders', userSessionManagement, userController.orderPageGet)
router.post("/order", userSessionManagement, userController.orderPost)
router.post("/confirm-order", userSessionManagement, userController.confirmOrderPost)
router.get("/order-success", userSessionManagement, userController.orderSuccessGet)
router.get("/order-failed", userSessionManagement, userController.orderFailedGet)
router.get("/cancel-order/:order_id", userSessionManagement, userController.cancelOrderGet)

// forgot password
router.get('/forgot-password', userController.ForgotPasswordGet)
router.get('/change-password/:user_id', userController.changePasswordGet)
router.post('/change-password/:user_id', userController.changePasswordPost)
router.post('/verify-forgot-password', userController.verifyuserOtpPost)
router.post('/:user_email/send-otp/:validation_type', userController.sendOtpEmailPost)

//validate otp verfication
router.get('/:user_id/validate-otp/2-factor', getTwoFactor)
router.post('/:user_id/validate-otp/2-factor', postTwoFactor)
router.get('/logout', userLogout)

module.exports = router