const { restaurantLogin, viewProducts, showProfile, addProduct, restaurantsignup, getRestaurantsignup, postRestaurantsignup, postSendOTP, getOtpPage, validateOtp, postOtpPage, getRestaurantLogin, postRestaurantLogin } = require('../controllers/restaurant')
const { sample } = require('../sampledata/sample')

const router = require('express').Router()
router.get('/', (req, res) => {
    res.send("hai")
})
router.get('/view_orders',)
//restaurant login
router.get('/restaurant_login', getRestaurantLogin)
router.post('/restaurant_login', postRestaurantLogin)
//restaurant signup
router.get('/restaurant_signup', getRestaurantsignup)
router.post('/restaurant_signup', postRestaurantsignup)

router.get('/view_products', viewProducts)

router.get('/restaurant_profile', showProfile)

router.get('/add_product', addProduct)

router.get('/add_product', addProduct)
//validate otp
router.get('/:restaurant_id/validate_otp', getOtpPage)
router.post('/:restaurant_id/validate_otp', postOtpPage)

module.exports = router