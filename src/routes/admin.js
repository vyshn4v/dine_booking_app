const adminController = require('../controllers/admin')
const { adminSessionmanagement } = require('../middlewares/session/admin')
const router = require('express').Router()

//admin login
router.get('/login', adminController.adminLoginGet)
router.post('/login', adminController.adminLoginPost)

// logout
router.get('/logout', adminController.adminLogoutGet)

// dashboard
router.get('/dashboard', adminSessionmanagement, adminController.dashBoardGet)

// users
router.get('/users', adminSessionmanagement, adminController.allUserGet)

//banned users

//ban user
router.put('/ban-user/:user_id', adminSessionmanagement, adminController.banUserPost)
router.post('/unban-user/:user_id', adminSessionmanagement, adminController.unbanUserPost)
router.get('/restaurants', adminSessionmanagement, adminController.allRestaurantGet)
router.get('/new-restaurants', adminSessionmanagement, adminController.newRestaurantGet)
router.get('/banned-restaurants', adminSessionmanagement, adminController.bannedRestaurantGet)
router.post('/ban-restaurant/:restaurant_id', adminSessionmanagement, adminController.banRestaurantPost)
router.post('/approve-restaurant/:restaurant_id', adminSessionmanagement, adminController.approveRestaurantPost)
router.post('/reject-restaurant/:restaurant_id', adminSessionmanagement, adminController.rejectRestaurantPost)
router.get('/restaurant/:restaurant_id', adminSessionmanagement, adminController.restauarntDetails)
router.get('/restaurant/:restaurant_id/available-foods', adminSessionmanagement, adminController.availableFoods)
router.get('/new-restaurants', adminSessionmanagement, adminController.availableFoods)
router.get('/categories', adminSessionmanagement, adminController.categoryGet)
router.post('/add-categories', adminSessionmanagement, adminController.categoryPost)
router.put('/categories/change-visibility/:category_id', adminSessionmanagement, adminController.categoryVisibilityPost)
router.delete('/categories/delete-category/:category_id', adminSessionmanagement, adminController.deleteCategoryPost)
//restauarnt management

module.exports = router