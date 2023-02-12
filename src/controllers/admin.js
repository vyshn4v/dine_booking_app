const admin = require("../models/admin")
const user = require("../models/user")
const restaurant = require("../models/restaurant")
const category = require("../models/category")
const
    dashBoardGet = (req, res) => {
        res.render("admin/dashBoard", { adminHeader: true, admin: true })
    },
    categoryGet = (req, res) => {
        category.find().sort({ createdAt: -1 }).then((categories) => {
            res.render("admin/category", { adminHeader: true, admin: true, categories })
        })
    },
    categoryPost = async (req, res) => {
        try {

            const newCategory = new category(req.body)
            await newCategory.save().then(() => {
                res.redirect('/admin/categories')
            })
        } catch (err) {
            req.session.err = "category not added"
            res.redirect('/admin/categories')
        }
    },
    categoryVisibilityPost = async (req, res) => {
        console.log(req.body);
        category.findByIdAndUpdate({ _id: req.params.category_id }, { $set: { "visibility": req.body.visibility } }).then(() => {
            res.json({ status: true, message: "visibility changed" })
        }).catch(() => {
            res.json({ status: false, message: "visibility not changed" })
        })
    },
    deleteCategoryPost = async (req, res) => {
        category.findByIdAndDelete({ _id: req.params.category_id }).then(() => {
            res.json({ status: true, message: "category deleted" })
        }).catch(() => {
            res.json({ status: false, message: "category not deleted" })
        })
    },
    allUserGet = (req, res) => {
        user.find(req.query?.filter ? { status: req.query?.filter } : null).then((users) => {
            users.map((user, index) => {
                const date = new Date(user.createdAt)
                users[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
            })
            res.render("admin/allUser", { adminHeader: true, users, admin: true })
        })
    },
    bannedUserGet = (req, res) => {
        user.find({ status: "banned" }).then((users) => {
            users.map((user, index) => {
                const date = new Date(user.createdAt)
                users[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
            })
            res.render("admin/bannedUser", { adminHeader: true, users, admin: true })
        })
    },
    banUserPost = (req, res) => {
        user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "status": "banned" } }).then(() => {
            res.json({ status: true, message: "user banned" })
        }).catch(() => {
            res.json({ status: false, message: "user not banned" })
        })
    },
    unbanUserPost = (req, res) => {
        user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "status": "active" } }).then(() => {
            res.json({ status: true, message: "user unbaned" })
        }).catch(() => {
            res.json({ status: false, message: "user not banned" })
        })
    },
    allRestaurantGet = (req, res) => {
        restaurant.find({ status: "active" }).then((restaurants) => {
            restaurants.map((restaurantData, index) => {
                const date = new Date(restaurantData.createdAt)
                restaurants[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
            })
            console.log(restaurants.length);
            res.render("admin/allRestaurant", { adminHeader: true, restaurants, admin: true })
        })
    },
    bannedRestaurantGet = (req, res) => {
        restaurant.find({ status: "banned" }).then((restaurants) => {
            console.log(restaurants);
            res.render("admin/bannedRestaurant", { adminHeader: true, restaurants, admin: true })
        })
    },
    banRestaurantPost = (req, res) => {
        console.log(req.params.restaurant_id);
        restaurant.findByIdAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "banned" } }).then((restaurants) => {
            res.json({ status: true, message: "restaurant banned" })
        })
    },
    newRestaurantGet = (req, res) => {
        restaurant.find({ status: "pending" }).then((restaurants) => {
            restaurants.map((restaurantData, index) => {
                const date = new Date(restaurantData.createdAt)
                restaurants[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
            })
            // console.log(restaurants[0].request_date);
            res.render("admin/newRestaurants", { adminHeader: true, restaurants, admin: true })
        })
    },
    approveRestaurantPost = (req, res) => {
        restaurant.findOneAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "active" } }).then((restaurants) => {
            res.json({ status: true, message: "restaurant success fully approve" })
        })
    },
    rejectRestaurantPost = (req, res) => {
        console.log(req.params.restaurant_id);
        restaurant.findOneAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "rejected" } }).then((restaurants) => {
            res.json({ status: true, message: "restaurant request rejected" })
        })
    },
    restauarntDetails = (req, res) => {
        let restaurant = sample.filter((data) => data.id == req.params.restaurant_id)[0]
        console.log(restaurant);

        res.render("admin/restaurantPage", { adminHeader: true, restaurant, admin: true })
    },
    availableFoods = (req, res) => {
        let restaurant = sample.filter((data) => data.id == req.params.restaurant_id)[0]
        console.log(restaurant);
        res.render("admin/availableFoods", { adminHeader: true, restaurant, admin: true })
    },
    newRestaurant = (req, res) => {
        res.render("admin/newRestaurants", { adminHeader: true, title: "orders", restaurant: sample, admin: true })
    }

module.exports = {
    dashBoardGet,
    categoryGet,
    categoryPost,
    categoryVisibilityPost,
    deleteCategoryPost,
    allUserGet,
    bannedUserGet,
    banUserPost,
    unbanUserPost,
    allRestaurantGet,
    bannedRestaurantGet,
    banRestaurantPost,
    newRestaurantGet,
    approveRestaurantPost,
    rejectRestaurantPost,
    restauarntDetails,
    availableFoods,
    newRestaurant,
}