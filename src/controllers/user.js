const user = require('../models/user')
const Order = require('../models/order')

const bcrypt = require('bcrypt')
const generateUserOtp = require('../helpers/generateUserOtp')
const otpTextGenerator = require('../helpers/generateOtpText')
const sendcancelMail = require('../helpers/sendCancelMail')
const restaurant = require('../models/restaurant')
const wishlist = require('../models/wishlist')
const Razorpay = require('razorpay');
const { dataUri } = require('../helpers/imagepload')
const { uploader } = require('../config/cloudinary')
const { default: mongoose } = require('mongoose')
const crypto = require('crypto')
const order = require('../models/order')


const pages = {
    USER_HOME_PAGE: "user/home",
    ORDER_PAGE: "user/order",
    RESTAURANT_PAGE: "user/restaurantPage",
    AVAILABLE_FOODS: "user/availableFoods",
    PAYMENT_DETAILS_PAGE: "user/paymentDetails",
    WISHLIST_PAGE: "user/wishList",
    LOGIN_PAGE: "user/login",
    SIGNUP_PAGE: "user/signup",
    PROFILE_PAGE: "user/profile",
    SEARCH_PRODUCTS: "user/searchRestaurant",
    CHANGE_PASSWORD: "user/changePassword",
    OTP_VERIFICATION: "user/otpValidation"
}


module.exports = {
    homePageGet: (req, res, next) => {
        restaurant.find({ profile_completed: { $eq: true }, status: { $eq: 'active' } }).then(async (restaurants) => {
            const newRestaurant = await restaurant.find({ profile_completed: { $eq: true }, status: { $eq: 'active' } }).sort({ createdAt: 1 }).limit(20)
            if (restaurants) {
                const data = {
                    user: req.session?.user ? true : false,
                    userHeader: true,
                    title: "home",
                    restaurants,
                    newRestaurant
                }
                res.render("user/home", data)
            }
        }).catch((err) => next(err))
    },
    buyProductGet: (req, res, next) => {
        restaurant.findById({ _id: req.params.restaurant_id }).then((restaurant) => {
            let data = {
                user: req.session?.user ? true : false,
                userHeader: true,
                restaurant: restaurant
            }
            res.render('user/products', data)
        }).catch((err) => next(err))
    },
    orderPageGet: (req, res, next) => {
        order.aggregate([{
            $match: {
                user_id: mongoose.Types.ObjectId(req.session.user.userId)
            }
        }, {
            $lookup: {
                from: 'users',
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            },
        }, {
            $unwind: "$user"
        }, {
            $lookup: {
                from: 'restaurants',
                localField: "restaurant_id",
                foreignField: "_id",
                as: "restaurant"
            }
        }, {
            $unwind: "$restaurant"
        }]).sort({createdAt:-1}).then((orders) => {
            let data = orders
            let products = []
            orders.map((order, index) => {
                order.products.map((product, index) => {
                    order.restaurant.menu.map((dish) => {
                        if (String(dish._id) === String(product.product_id)) {
                            products.push({ ...dish, quantity: product.quantity })
                        }
                    })
                })
                data[index].menu = products
                const date = new Date(data[index].date)
                data[index].date = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
                // time
                const time = new Date(data[index].time)
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                data[index].time = strTime
                products = []
            })
            res.render(pages.ORDER_PAGE, { userHeader: true, user: req.session?.user ? true : false, title: "orders", orders: { ...orders, ...products } })
        }).catch((err) => next(err))
    },
    tablesPageGet: (req, res, next) => {
        restaurant.findOne({ _id: req.params.restaurant_id }, { "tables": 1 }).then((tables) => {
            console.log(tables);
            res.render('user/showTables', { tables: tables.tables })
        }).catch((err) => next(err))
    },
    bookTablePost: (req, res, next) => {
        const keys = Object.keys(req.body)
        console.log(keys);
        let result = []
        for (let i = 0; i < keys.length; i++) {
            result.push({
                product_id: keys[i],
                quantity: req.body[keys[i]]
            })
        }
        console.log(result);
    },
    searchGet: (req, res, next) => {
        try {

            const options = {
                page: req.query.nextPage || req.query.prevPage || 1,
                limit: 5,
                collation: {
                    locale: 'en',
                },
            };
            restaurant.paginate({ restaurant_name: new RegExp(req.query.search) }, options).then((restaurants) => {
                console.log(restaurants);
                const { docs, ...rest } = restaurants
                res.render('user/searchRestaurant', { userHeader: true, user: true, restaurants: restaurants.docs, pagination: rest, search: req.query.search })
            })
        } catch (err) {
            next(err)
        }
    },
    updateReview: (req, res, next) => {
        try {
            console.log(req.body);
            restaurant.find({ _id: req.body.restaurant_id, "review.user_id": req.session.user.userId }).count().then((count) => {
                if (count === 0) {
                    restaurant.findByIdAndUpdate({ _id: req.body.restaurant_id }, {
                        $push: { review: { user_id: req.session.user.userId, review: req.body.review } }
                    }).then(() => res.redirect('/restaurant-details/' + req.body.restaurant_id))
                } else {
                    res.redirect('/')
                }
            })
        } catch (err) {
            next(err)
        }
    },
    restaurantPageGet: async (req, res, next) => {
        try {
            let restaurantDetails = await restaurant.findById({ _id: req.params.restaurant_id })
            let review = await restaurant.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.restaurant_id) } }, {
                $unwind: "$review"
            }, {
                $lookup: {
                    from: "users",
                    localField: "review.user_id",
                    foreignField: "_id",
                    as: "users"
                }
            }])
            res.render("user/restaurantNew", { userHeader: true, title: "restaurant", restaurantDetails, review, userId: req.session.user.userId })
        } catch (err) {
            next(err)
        }
    },

    availableFoodGet: (req, res, next) => {
        let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
        res.render(pages.AVAILABLE_FOODS, { userHeader: true, title: "avaialble foods", restaurant })
    },

    paymentDetailsGet: (req, res, next) => {
        // console.log(req.body);
        const keys = Object.keys(req.body)
        let result = []
        for (let i = 0; i < keys.length; i++) {
            result.push({
                product_id: keys[i],
                quantity: req.body[keys[i]]
            })
        }
        let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
        res.render(pages.PAYMENT_DETAILS_PAGE, { userHeader: true, user: req.session?.user ? true : false, title: "payment details", restaurant })
    },

    wishListGet: (req, res, next) => {
        try {
            wishlist.aggregate([{
                $unwind: "$products"
            },
            {
                $project: {
                    "products": {
                        "$toObjectId": "$products"
                    },
                    "user_id": {
                        "$toObjectId": "$user_id"
                    }
                }
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: "products",
                    foreignField: '_id',
                    as: "restaurant"
                }
            },
            {
                $unwind: "$restaurant"
            }
            ]).then((data) => {
                res.render(pages.WISHLIST_PAGE, { userHeader: true, user: req.session?.user ? true : false, title: "wishlist", wishlistData: data })
            })
        } catch (err) {
            next(err)
        }
    }
    ,
    removeFromWhishListPost: (req, res, next) => {
        wishlist.findByIdAndUpdate({ _id: req.params.wishlist_id }, { $pull: { products: req.params?.product_id } }).then((data) => {
            res.json({ status: true, message: "success" })
        }).catch(() => {
            res.json({ status: false, message: "failed" })
        })
    },
    wishListPost: (req, res, next) => {
        try {
            wishlist.find({ user_id: req.session.user.userId, products: { $eq: req.params.product_id } }).count().then((result) => {
                if (result <= 0) {
                    wishlist.findOneAndUpdate({ user_id: req.session.user.userId }, { $push: { products: req.params.product_id } }, { upsert: true }).then(() => {
                        res.json({ status: true, message: "wish list success fully updated" })
                    }).catch((err) => {
                        res.json({ status: false, message: "failed to update wishlist" })
                    })
                } else {
                    res.json({ status: false, message: "item already in wish list" })
                }
            })
        } catch (err) {
            next(err)
        }
    }
    ,
    selectedItemsPost: (req, res) => {
        req.session.orderedItems = null
        const keys = Object.keys(req.body)
        let result = []
        for (let i = 0; i < keys.length; i++) {
            console.log(req.body[keys[i]]);
            if (req.body[keys[i]] > 0 && keys[i] != 'restaurantId') {
                result.push({
                    product_id: keys[i],
                    quantity: req.body[keys[i]]
                })
            }
        }
        req.session.orderedItems = result
        res.redirect('/select-tables/' + req.params.restaurant_id)
    },
    selectTablesGet: async (req, res, next) => {
        try {
            let data = null
            if (req.query?.category == "Ac") {
                data = {
                    _id: req.params.restaurant_id,
                    "tables.air_conditioned": "AC"
                }
            } else if (req.query?.category == "Non_Ac") {
                data = {
                    _id: req.params.restaurant_id,
                    "tables.air_conditioned": "Non Ac"
                }
            } else {
                data = {
                    _id: req.params.restaurant_id
                }
            }

            const tables = await restaurant.find(data, { tables: 1 })
            res.render('user/selectTables', { userHeader: true, tables: tables[0]?.tables, restaurantId: req.params.restaurant_id })
        } catch (err) {
            next(err)
        }
    }
    ,
    checkOutGet: (req, res, next) => {
        const result = req.session.orderedItems
        restaurant.findById({ _id: req.params?.restaurant_id }).then((restaurantDetails) => {
            const products = []
            const tables = []
            restaurantDetails.menu?.map((data) => {
                result?.map((product) => {
                    if (product.product_id == data._id) {
                        let productDetails = {
                            ...data._doc,
                            quantity: Number(product.quantity)
                        }
                        products.push(productDetails)
                    }
                })
            })
            restaurantDetails.tables?.map((data) => {
                req.body?.tables?.map((product) => {
                    if (product == data._id) {
                        let productDetails = {
                            ...data._doc,
                        }
                        tables.push(productDetails)
                    }
                })
            })
            let totalProductPrice = null;
            let totalChair = 0
            req.session.selectTables = tables
            req.session.productDetails = products
            console.log(tables);
            products?.map((data) => {
                totalProductPrice += ((data.price) * (data.quantity))
            })
            tables.map((table) => {
                (totalChair += table?.chair)
            })
            res.render('user/paymentDetails', { userHeader: true, user: req.session?.user ? true : false, title: "payment page", restaurant: restaurantDetails, products, totalProductPrice, tables, totalChair })
        }).catch((err) => next(err))
    }
    ,
    signupGet: (req, res, next) => {
        res.render('user/signup', { userHeader: true, user: req.session?.user ? true : false, title: "user signup", err: req.session.err })
    },
    signupPost: async (req, res, next) => {
        try {
            const userStatus = (await user.find({ email: req.body?.email })).length
            console.log(userStatus == 0);
            if (userStatus == 0) {
                const { confirm_password, ...rest } = req.body
                rest.password = await bcrypt.hash(req.body.password, Number(process.env.SALT_ROUND))
                const User = new user(rest)
                const savedUser = await User.save()
                generateUserOtp(savedUser._id).then((user) => {
                    const otpText = otpTextGenerator(user.OTP, "verify-profile")
                    sendOtpViaMail(otpText, user.email).then(() => {
                        req.session.user = {
                            userId: user._id,
                            email: user.email,
                            email_verification: user.verified
                        }
                        res.redirect(`${savedUser._id}/validate-otp`)
                    }).catch(() => {
                        req.session.err = "otp not sent"
                        res.redirect("/login")
                    })
                }).catch(() => {
                    console.log("err1");
                })
            } else {
                req.session.err = "email already taken"
                res.redirect("/signup")
            }
        } catch (err) {
            next(err)
        }
    },


    profileGet: (req, res, next) => {
        user.findById({ _id: req.session.user.userId }).then((userDetails) => {
            res.render("user/profile", { userHeader: true, title: "Profile", userId: req.session.user.userId, userDetails })
        })
    },
    profilePost: async (req, res, next) => {
        const { password, ...rest } = req.body
        try {

            if (req.file) {
                const file = await dataUri(req.file).content
                await uploader.upload(file).then(async (result) => {
                    console.log(result);
                    await user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "profile_pic": { "url": result.url, "public_key": result.public_id } } }).then(async (user) => {
                        await uploader.destroy(user.profile_pic?.public_key)
                    })
                })
            }
            await user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { ...rest } })
            res.redirect('/profile')
        } catch (err) {
            next(err)
        }
    },
    searchProductsGet: (req, res, next) => {
        res.render(pages.SEARCH_PRODUCTS, { restaurants: sample })
    },
    changePasswordGet: (req, res, next) => {
        res.render(pages.CHANGE_PASSWORD, { userHeader: true, title: "Change password", userId: req.params.user_id })
    }
    ,
    otpVerificationGet: (req, res, next) => {
        user.findOne({ _id: req.params.user_id }).then((user) => {
            res.render(pages.OTP_VERIFICATION, { userHeader: true, title: "OTP verification", otpCount: user.otp.expiredAt, userId: user._id })
        }).catch((err) => next(err))
    },
    otpVerificationPost: async (req, res, next) => {
        try {
            user.findById({ _id: req.params.user_id }).then((userData) => {
                let expired = new Date(userData.otp.expiredAt)
                let currentDate = new Date();
                console.log(req.body);
                bcrypt.compare(req.body.otp, userData.otp.otp).then((status) => {
                    if (status && expired > currentDate) {
                        user.findByIdAndUpdate({ _id: userData._id }, { $set: { "verified": true, "otp.otp": "" } }, { new: true }).then((restaurantnew) => {
                            console.log(restaurantnew);
                            res.redirect('/')
                        })
                    } else {
                        res.redirect(`/${req.params.user_id}/validate-otp`)
                    }
                })
            })
        } catch (err) {
            next(err)
        }
    },
    orderPost: async (req, res, next) => {
        try {

            const razorpayInstance = new Razorpay({
                // Replace with your key_id
                key_id: process.env.RAZOR_PAY_KEY_ID,
                // Replace with your key_secret
                key_secret: process.env.RAZOR_PAY_KEY_SECRET
            });
            // const { amount } = req.body
            console.log("orders", req.body);
            razorpayInstance.orders.create({
                amount: req.body.amount * 100,
                currency: "INR",
            }, (err, order) => {
                console.log(err);
                console.log(order);
                res.json({
                    success: true,
                    order,
                    amount: req.body?.amount
                })
            })
        } catch (err) {
            next(err)
        }
    },
    confirmOrderPost: async (req, res, next) => {
        try {
            const razorpayInstance = new Razorpay({
                // Replace with your key_id
                key_id: process.env.RAZOR_PAY_KEY_ID,
                // Replace with your key_secret
                key_secret: process.env.RAZOR_PAY_KEY_SECRET
            });
            const order = await razorpayInstance.orders.fetch(req.body.response.razorpay_order_id)
            if (order.status === 'paid') {
                console.log(req.body);
                console.log("req.session" + req.session);
                const newOrder = new Order({
                    restaurant_id: req.body.restaurant_id,
                    user_id: req.session.user.userId,
                    products: req.session.orderedItems,
                    tables: req.session.selectTables,
                    date: Date.parse(req.body.date),
                    time: new Date(req.body.time),
                    guestName: req.body?.guestName,
                    guestPhone: req.body?.guestPhone,
                    total_price: req.body.amount,
                    razor_pay_order_id: req.body.response.razorpay_order_id
                })
                newOrder.save().then((data) => {
                    res.json({ status: true, message: "order placed" })
                }).catch(() => {
                    res.json({
                        status: false, message: "order not placed"
                    })
                })
            } else {
                res.json({
                    status: false, message: "order not placed"
                })
            }
        } catch (err) {
            next(err)
        }
    },
    orderSuccessGet: (req, res, next) => {
        res.render('user/order-success', { data: req?.query, tables: req.session?.selectTables, orders: req.session?.productDetails })
    },
    orderFailedGet: (req, res) => {
        res.render('user/order-canceled')
    },
    cancelOrderGet: (req, res, next) => {
        try {
            order.findByIdAndUpdate({ _id: req.params.order_id }, { status: "canceled" }).then(async (data) => {
                // console.log("refund" + data);
                const razorpayInstance = await new Razorpay({
                    // Replace with your key_id
                    key_id: process.env.RAZOR_PAY_KEY_ID,
                    // Replace with your key_secret
                    key_secret: process.env.RAZOR_PAY_KEY_SECRET
                });
                const order = await razorpayInstance.orders.fetchPayments(data.razor_pay_order_id)
                const refund = await razorpayInstance.payments.refund(order.items[0].id, {
                    "amount": data.total_price,
                    "speed": "optimum",
                })
                console.log(refund);
                const userDetails = await user.findById({ _id: data.user_id })
                if (refund.status === 'processed') {
                    const emailTemplate = otpTextGenerator(restaurant.OTP, "refund-payment");
                    sendcancelMail(emailTemplate, userDetails.email).then((status) => {
                        res.json({ status: true, message: "Order canceled" })
                    }).catch((err) => {
                        next(err)
                    })
                }
            }).catch((err) => {
                next(err)
            })
        } catch (err) {
            next(err)
        }
    },
    ForgotPasswordGet: (req, res, next) => {
        res.render('user/forgotPassword', { userHeader: true })
    },
    ChangePasswordGet: (req, res, next) => {
        res.render("user/changePassword", { userId: req.params.user_id })
    },
    changePasswordPost: (req, res, next) => {
        console.log(req.body, Number(process.env.SALT_ROUND));
        bcrypt.hash(req.body.password, Number(process.env.SALT_ROUND)).then((hashedPassword) => {
            user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "password": hashedPassword } }).then(() => {
                res.redirect("/login")
            })
        }).catch((err) => {
            next(err)
        })
    }
    ,
    tableDetailsget: (req, res, next) => {
        restaurant.find({ _id: req.params.restaurant_id }).then((restaurant) => {
            console.log("restaurant" + restaurant[0].tables);
            const selectedTable = restaurant[0].tables?.filter((table) => table._id == req.params.table_id)
            res.json({ status: true, selectedTable: selectedTable[0] })
        }).catch((err) => next(err))
    },
    verifyuserOtpPost: (req, res, next) => {
        try {
            user.findOne({ email: req.body.email }).then((userData) => {
                let expired = new Date(userData.otp.expiredAt)
                let currentDate = new Date();
                console.log(req.body);
                console.log(userData);
                bcrypt.compare(req.body.otp, userData.otp.otp).then((status) => {
                    if (status && expired > currentDate) {
                        user.findByIdAndUpdate({ _id: userData._id }, { $set: { "otp.otp": "" } }, { new: true }).then((userDataUpdated) => {
                            res.redirect('/change-password/' + userDataUpdated._id)
                        })
                    } else {
                        res.redirect(`/forgot-password`)
                    }
                })
            })
        } catch (err) {
            next(err)
        }
    },

    sendOtpEmailPost: (req, res, next) => {
        try {
            user.findOne({ email: req.params.user_email }).then((userData => {
                generateUserOtp(userData._id).then((restaurant) => {
                    console.log(req.params.validation_type);
                    const emailTemplate = otpTextGenerator(restaurant.OTP, req.params.validation_type);
                    sendOtpViaMail(emailTemplate, restaurant.email).then((status) => {
                        res.json({ status: true, message: "email successfully send to " + restaurant.email, otpTime: restaurant.otp.expiredAt })
                    }).catch((status) => {
                        res.json({ status: false, message: "mail not send to" + restaurant.email })
                    })
                }).catch((status) => {
                    res.json({ status: false, message: "otp not generated" })
                })
            })).catch(() => {
                res.json({ status: false, message: "email not found" })
            })
        } catch (err) {
            res.json({ status: false, message: "something went wrong" })
        }
    },

}