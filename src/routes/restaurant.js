const {
    getRestaurantLogin,
    postRestaurantLogin,
    getRestaurantSignup,
    postRestaurantSignup,
    postSendOtpEmail,
    getOtpPage,
    getOtpTwoFactorPage,
    postverifyRestaurantOtp, 
    deleteAccount} = require('../controllers/Auth')
const restaurantController = require('../controllers/restaurant')
const {
    restaurantSessionManagement,
    validateUserAlreadySignup,
    restaurantAuthManagement,
    restaurantProfileVerfication } = require('../middlewares/session/restaurant')
const profilePic = require('../helpers/restaurantProfilePic')
const router = require('express').Router()

//restaurant login
router.get('/login', restaurantAuthManagement, getRestaurantLogin)
router.post('/login', restaurantAuthManagement, postRestaurantLogin)

router.get('/logout', restaurantController.restaurantLogout)
//view orders
router.get('/view-orders', restaurantSessionManagement, restaurantController.viewOrdersGet)

//restaurant signup
router.get('/signup', restaurantAuthManagement, getRestaurantSignup)
router.post('/signup', restaurantAuthManagement, validateUserAlreadySignup, postRestaurantSignup)

//view products
router.get('/view-products', restaurantSessionManagement, restaurantController.viewOrdersGet)

//profile
router.get('/profile', restaurantSessionManagement, restaurantController.showProfileGet)
router.post('/profile/save-details', profilePic.single('profile_pic'), restaurantController.saveProfilePost)
router.post('/profile/update-tables', restaurantController.saveTablePost)

//add product
router.get('/add-products', restaurantSessionManagement, restaurantController.addProductGet)
router.post('/add-products', restaurantSessionManagement, restaurantController.addProductPost)
//add  service
router.get('/add-service', restaurantSessionManagement, restaurantController.addServiceGet)
router.post('/add-service', restaurantSessionManagement, restaurantController.addServicePost)

//forgot password 
router.get('/forgot-password', restaurantController.forgotPasswordGet)
router.get('/change-password/:restaurant_id', restaurantController.changePasswordGet)
router.post('/verify-forgot-password', postverifyRestaurantOtp)
router.post('/change-password/:restaurant_id', restaurantController.changePasswordPost)

//validate otp verification
router.get('/:restaurant_id/validate-otp/2-factor', getOtpTwoFactorPage)
router.get('/:restaurant_id/validate-otp/verify-profile', getOtpPage)
router.post('/:restaurant_id/validate-otp/:validation_type', restaurantController.OtpVerificationPost)
router.post('/:restaurant_email/send-verification-otp/:validation_type', postSendOtpEmail)
// delete account
router.post('/delete-account/:restaurant_id', deleteAccount)

module.exports = router