const {
    getRestaurantLogin,
    postRestaurantLogin,
    getRestaurantSignup,
    postRestaurantSignup,
    postSendOtpEmail,
    getOtpPage,
    getOtpTwoFactorPage,
    postverifyRestaurantOtp,
    deleteAccount } = require('../controllers/Auth')
const restaurantController = require('../controllers/restaurant')
const serviceController = require('../controllers/service')
const {
    restaurantSessionManagement,
    validateUserAlreadySignup,
    restaurantAuthManagement,
    restaurantProfileVerfication,
    sessionProfileVerified } = require('../middlewares/session/restaurant')
const imagepload = require('../helpers/imagepload')
const router = require('express').Router()

//restaurant login
router.get('/login', restaurantAuthManagement, getRestaurantLogin)
router.post('/login', restaurantAuthManagement, postRestaurantLogin)

router.get('/logout', restaurantController.restaurantLogout)
//view orders
router.get('/view-orders', restaurantSessionManagement, sessionProfileVerified, restaurantController.viewOrdersGet)
router.put("/:order_id/approve-order", restaurantSessionManagement, restaurantController.approveOrderPost)
router.put("/:order_id/reject-order", restaurantSessionManagement, restaurantController.cancelOrderPost)
//restaurant signup
router.get('/signup', restaurantAuthManagement, getRestaurantSignup)
router.post('/signup', restaurantAuthManagement, validateUserAlreadySignup, postRestaurantSignup)


//profile
router.get('/profile', restaurantSessionManagement, restaurantController.showProfileGet)
router.post('/profile/save-details', restaurantSessionManagement, imagepload.multer.array('profile_pic', 10), restaurantController.saveProfilePost)
router.post('/restaurant/edit-profile-pic/:public_id', restaurantSessionManagement, imagepload.multer.single('images'), restaurantController.editProfilPicGet)

// table management
router.get('/table-management', restaurantSessionManagement, sessionProfileVerified, restaurantController.tableManagementGet)
router.post('/profile/update-tables', restaurantSessionManagement, restaurantController.saveTablePost)
router.post('/profile/delete-tables/:table_id', restaurantSessionManagement, restaurantController.deleteTablePost)

// service management
router.get('/manage-services', restaurantSessionManagement, sessionProfileVerified, serviceController.serviceManagementGet)
router.get('/add-service', restaurantSessionManagement, sessionProfileVerified, restaurantController.addServiceGet)
router.get('/edit-service/:service_id', restaurantSessionManagement, sessionProfileVerified, restaurantController.editServiceGet)
router.post('/add-service', restaurantSessionManagement, restaurantController.addServicePost)
router.post('/update-service/:service_id', restaurantSessionManagement, restaurantController.updateService)
router.put('/delete-service/:service_id', restaurantSessionManagement, serviceController.deleteServicePost)

//product
router.get('/view-products', restaurantSessionManagement, sessionProfileVerified, restaurantController.viewProductsGet)
router.get('/add-products', restaurantSessionManagement, sessionProfileVerified, restaurantController.addProductGet)
router.post('/add-products', restaurantSessionManagement, imagepload.multer.single('product_image'), restaurantController.addProductPost)
router.get('/edit-product/:product_id', restaurantSessionManagement, sessionProfileVerified, restaurantController.editProductGet)
router.post('/edit-product/:product_id', restaurantSessionManagement, imagepload.multer.single('product_image'), restaurantController.editProductPost)
router.post('/delete-product/:product_id', restaurantSessionManagement,restaurantController.deleteProductPost)
//forgot password 
router.get('/forgot-password', restaurantController.forgotPasswordGet)
router.post('/verify-forgot-password', postverifyRestaurantOtp)
router.get('/change-password/:restaurant_id', restaurantController.changePasswordGet)
router.post('/change-password/:restaurant_id', restaurantController.changePasswordPost)

// change password
router.post('/update-password/:restaurant_id', restaurantController.changePasswordviaProfilePost)

//validate otp verification
router.get('/:restaurant_id/validate-otp/2-factor', restaurantAuthManagement, getOtpTwoFactorPage)
router.get('/:restaurant_id/validate-otp/verify-profile', getOtpPage)
router.post('/:restaurant_id/validate-otp/:validation_type', restaurantController.OtpVerificationPost)
router.post('/:restaurant_email/send-verification-otp/:validation_type', postSendOtpEmail)

// delete account
router.delete('/delete-account/:restaurant_id', deleteAccount)

module.exports = router