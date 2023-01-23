const { getAdminLogin, postAdminLogin } = require('../controllers/admin')
const { sample } = require('../sampledata/sample')
const router = require('express').Router()

//admin login
router.get('/admin_login',getAdminLogin)
router.post('/admin_login',postAdminLogin)

router.get('/dash_board', (req, res) => {
    res.render("admin/dashBoard", { adminHeader: true })
})
router.get('/all_users', (req, res) => {
    res.render("admin/allUsers", { adminHeader: true, users: [{}, {}, {}, {}, {}, {}] })
})
router.get('/all_restaurant', (req, res) => {
    res.render("admin/allRestaurant", { adminHeader: true, users: [{}, {}, {}, {}, {}, {}] })
})
router.get('/restaurant/:restaurant_id', (req, res) => {
    let restaurant = sample.filter((data) => data.id == req.params.restaurant_id)[0]
    console.log(restaurant);
    res.render("admin/restaurantPage", { adminHeader: true, restaurant })
})
router.get('/restaurant/:restaurant_id/available_foods', (req, res) => {
    let restaurant = sample.filter((data) => data.id == req.params.restaurant_id)[0]
    console.log(restaurant);
    res.render("admin/availableFoods", { adminHeader: true, restaurant })
})
router.get('/new_restaurants', (req, res) => {
    res.render("admin/newRestaurants", { adminHeader: true, title: "orders", restaurant: sample })
})

module.exports = router