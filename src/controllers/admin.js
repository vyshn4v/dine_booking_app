const admin = require("../models/admin")
const user = require("../models/user")
const sendEmail = require('../helpers/sendOtpMail')
const restaurant = require("../models/restaurant")
const category = require("../models/category")
const otpTextGenerator = require("../helpers/generateOtpText")
const order = require("../models/order")
const
    dashBoardGet = async (req, res, next) => {
        const totalRestaurants = await restaurant.countDocuments({})
        const totalRestaurantsInMonth = await restaurant.find({
            $where: function () {
                var currentDate = new Date();
                var lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth()))
                return this.createdAt.getFullYear() === lastMonthDate.getFullYear()
                    && this.createdAt.getMonth() === lastMonthDate.getMonth();
            }
        }).count()
        const totalUsersInMonth = await user.find({
            $where: function () {
                var currentDate = new Date();
                var lastMonthDate = new Date(currentDate.setMonth(currentDate.getMonth()))
                return this.createdAt.getFullYear() === lastMonthDate.getFullYear()
                    && this.createdAt.getMonth() === lastMonthDate.getMonth();
            }
        }).count()
        const totalUsers = await user.countDocuments({})
        const data = {
            totalRestaurants,
            totalRestaurantsInMonth,
            totalUsers,
            totalUsersInMonth,
            adminHeader: true,
            admin: true
        }
        res.render("admin/dashBoard", data)
    },
    dashBoardDataGet = async (req, res, next) => {
        //month wise data
        const FIRST_MONTH = 1
        const LAST_MONTH = 12
        const TODAY = new Date()
        const YEAR_BEFORE = new Date(TODAY)
        YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1)
        const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const pipeLine = [{
            $match: {
                createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
            }
        },
        {
            $group: {
                _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year_month": 1 }
        },
        {
            $project: {
                _id: 0,
                count: 1,
                month_year: {
                    $concat: [
                        { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                        "-",
                        { $substrCP: ["$_id.year_month", 0, 4] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                data: { $push: { k: "$month_year", v: "$count" } }
            }
        },
        {
            $addFields: {
                start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
                end_year: { $substrCP: [TODAY, 0, 4] },
                months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
                months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
            }
        },
        {
            $addFields: {
                template_data: {
                    $concatArrays: [
                        {
                            $map: {
                                input: "$months1",
                                as: "m1",
                                in: {
                                    count: 0,
                                    month_year: {
                                        $concat: [
                                            { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                                            "-",
                                            "$start_year"
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $map: {
                                input: "$months2",
                                as: "m2",
                                in: {
                                    count: 0,
                                    month_year: {
                                        $concat: [
                                            { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                                            "-",
                                            "$end_year"
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            $addFields: {
                data: {
                    $map: {
                        input: "$template_data",
                        as: "t",
                        in: {
                            k: "$$t.month_year",
                            v: {
                                $reduce: {
                                    input: "$data",
                                    initialValue: 0,
                                    in: {
                                        $cond: [
                                            { $eq: ["$$t.month_year", "$$this.k"] },
                                            { $add: ["$$this.v", "$$value"] },
                                            { $add: [0, "$$value"] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                data: { $arrayToObject: "$data" },
                _id: 0
            }
        }]
        const userChart = await user.aggregate(pipeLine)
        const restaurantChart = await restaurant.aggregate(pipeLine)
        const orderChart = await order.aggregate(pipeLine)
        res.json({
            userChart,
            restaurantChart,
            orderChart
        })
    },
    categoryGet = (req, res, next) => {
        try {
            category.find().sort({ createdAt: -1 }).then((categories) => {
                res.render("admin/category", { adminHeader: true, admin: true, categories })
            })
        } catch (err) {
            next(err)
        }
    },
    categoryPost = async (req, res, next) => {
        try {
            const newCategory = new category({ category: req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1) })
            await newCategory.save().then(() => {
                res.redirect('/admin/categories')
            })
        } catch (err) {
            req.session.err = "category not added"
            res.redirect('/admin/categories')
        }
    },
    categoryVisibilityPost = async (req, res, next) => {
        category.findByIdAndUpdate({ _id: req.params.category_id }, { $set: { "visibility": req.body.visibility } }).then(() => {
            res.json({ status: true, message: "visibility changed" })
        }).catch(() => {
            res.json({ status: false, message: "visibility not changed" })
        })
    },
    deleteCategoryPost = async (req, res, next) => {
        category.findByIdAndDelete({ _id: req.params.category_id }).then(() => {
            res.json({ status: true, message: "category deleted" })
        }).catch(() => {
            res.json({ status: false, message: "category not deleted" })
        })
    },
    allUserGet = (req, res, next) => {
        try {
            user.find(req.query?.filter ? { status: req.query?.filter } : null).then((users) => {
                users.map((user, index) => {
                    const date = new Date(user.createdAt)
                    users[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
                })
                res.render("admin/allUser", { adminHeader: true, users, admin: true })
            })
        } catch (err) {
            next(err)
        }
    },
    bannedUserGet = (req, res, next) => {
        try {
            user.find({ status: "banned" }).then((users) => {
                users.map((user, index) => {
                    const date = new Date(user.createdAt)
                    users[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
                })
                res.render("admin/bannedUser", { adminHeader: true, users, admin: true })
            })
        } catch (err) {
            next(err)
        }
    },
    banUserPost = (req, res, next) => {
        try {
            user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "status": "banned" } }).then(() => {
                res.json({ status: true, message: "user banned" })
            }).catch(() => {
                res.json({ status: false, message: "user not banned" })
            })
        } catch (err) {
            next(err)
        }
    },
    unbanUserPost = (req, res, next) => {
        user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "status": "active" } }).then(() => {
            res.json({ status: true, message: "user unbaned" })
        }).catch(() => {
            res.json({ status: false, message: "user not banned" })
        })
    },
    allRestaurantGet = (req, res, next) => {
        try {

            restaurant.find({ status: "active" }).then((restaurants) => {
                restaurants.map((restaurantData, index) => {
                    const date = new Date(restaurantData.createdAt)
                    restaurants[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
                })
                console.log(restaurants.length);
                res.render("admin/allRestaurant", { adminHeader: true, restaurants, admin: true })
            })
        } catch (err) {
            next(err)
        }
    },
    bannedRestaurantGet = (req, res, next) => {
        try {
            restaurant.find({ status: "banned" }).then((restaurants) => {
                res.render("admin/bannedRestaurant", { adminHeader: true, restaurants, admin: true })
            })
        } catch (err) {
            next(err)
        }
    },
    banRestaurantPost = (req, res, next) => {
        try {
            restaurant.findByIdAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "banned" } }).then((restaurants) => {
                res.json({ status: true, message: "restaurant banned" })
            })
        } catch (err) {
            res.json({ status: false, message: "an error occured" })
        }
    },
    newRestaurantGet = (req, res, next) => {
        try {
            restaurant.find({ status: "pending" }).then((restaurants) => {
                restaurants.map((restaurantData, index) => {
                    const date = new Date(restaurantData.createdAt)
                    restaurants[index].request_date = String(date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear())
                })
                res.render("admin/newRestaurants", { adminHeader: true, restaurants, admin: true })
            })
        } catch (err) {

        }
    },
    approveRestaurantPost = (req, res, next) => {
        try {
            restaurant.findOneAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "active" } }).then(async (restauarnt) => {
                const text = await otpTextGenerator(null, "approve-restaurant")
                await sendEmail(text, restauarnt.email)
            }).then((restaurants) => {
                res.json({ status: true, message: "restaurant success fully approve" })
            })
        } catch (err) {
            res.json({ status: false, message: "an error occured" })
        }
    },
    rejectRestaurantPost = (req, res, next) => {
        try {
            if (req.params.restaurant_id) {
                restaurant.findOneAndUpdate({ _id: req.params.restaurant_id }, { $set: { "status": "rejected" } }).then((restaurants) => {
                    res.json({ status: true, message: "restaurant request rejected" })
                })
            } else {
                res.json({ status: false, message: "restaurant id is not available" })
            }
        } catch (err) {
            res.json({ status: true, message: "an error occured" })
        }
    },
    restauarntDetails = (req, res, next) => {
        res.render("admin/restaurantPage", { adminHeader: true, restaurant, admin: true })
    },
    availableFoods = (req, res, next) => {
        res.render("admin/availableFoods", { adminHeader: true, admin: true })
    },
    newRestaurant = (req, res, next) => {
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
    dashBoardDataGet
}