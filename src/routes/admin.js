const adminController = require('../controllers/admin')
const authController = require("../controllers/Auth")
const { adminSessionmanagement } = require('../middlewares/session/admin')
const router = require('express').Router()

router.get('/login', authController.adminLoginGet)

router.post('/login', authController.adminLoginPost)

router.get('/logout', authController.adminLogoutGet)

router.get('/dashboard', adminSessionmanagement, adminController.dashBoardGet)

router.get('/get-month-wise-data', adminSessionmanagement, adminController.dashBoardDataGet)

router.get('/users', adminSessionmanagement, adminController.allUserGet)

router.put('/ban-user/:user_id', adminSessionmanagement, adminController.banUserPost)

router.put('/unban-user/:user_id', adminSessionmanagement, adminController.unbanUserPost)

router.get('/get-all-restaurants', adminSessionmanagement, adminController.allRestaurantGet)

router.get('/restaurants', adminSessionmanagement, adminController.allRestaurantGet)

router.get('/new-restaurants', adminSessionmanagement, adminController.newRestaurantGet)

router.get('/banned-restaurants', adminSessionmanagement, adminController.bannedRestaurantGet)

router.put('/ban-restaurant/:restaurant_id', adminSessionmanagement, adminController.banRestaurantPost)

router.post('/approve-restaurant/:restaurant_id', adminSessionmanagement, adminController.approveRestaurantPost)

router.post('/reject-restaurant/:restaurant_id', adminSessionmanagement, adminController.rejectRestaurantPost)

router.get('/restaurant/:restaurant_id', adminSessionmanagement, adminController.restauarntDetails)

router.get('/restaurant/:restaurant_id/available-foods', adminSessionmanagement, adminController.availableFoods)

router.get('/new-restaurants', adminSessionmanagement, adminController.availableFoods)

router.get('/categories', adminSessionmanagement, adminController.categoryGet)

router.post('/add-categories', adminSessionmanagement, adminController.categoryPost)

router.put('/categories/change-visibility/:category_id', adminSessionmanagement, adminController.categoryVisibilityPost)

router.delete('/categories/delete-category/:category_id', adminSessionmanagement, adminController.deleteCategoryPost)

module.exports = router