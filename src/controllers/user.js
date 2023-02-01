const { sample } = require('../sampledata/sample')

//data base schemas
const user = require('../models/user')

//
const bcrypt = require('bcrypt')
const SALT_ROUND = require('../config/bcrypt')
const generateUserOtp = require('../helpers/generateUserOtp')
const otpTextGenerator = require('../helpers/generateOtpText')
const sendOtpViaMail = require('../helpers/sendOtpMail')
const restaurant = require('../models/restaurant')
//pages
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

///GET - Home page
module.exports = {
    homePageGet: (req, res) => {
        restaurant.find({}).then((restaurants) => {
            if (restaurants) {
                let data = {
                    userHeader: true,
                    title: "home",
                    restaurants
                }
                res.render(pages.USER_HOME_PAGE, data)
            }
        })
    },
    ///GET - Order Page
    orderPageGet: (req, res) => {
        let total = 0;
        sample.map((data) => {
            total += data.price
        })
        res.render(pages.ORDER_PAGE, { userHeader: true, title: "orders", cart: sample, total })
    },
    tablesPageGet: (req, res) => {
        restaurant.findOne({ _id: req.params.restaurant_id }, { "tables": 1 }).then((tables) => {
            console.log(tables);
            res.render('user/showTables', { tables: tables.tables })
        })
    },
    bookTablePost: (req, res) => {
        console.log(req.body);
    },
    restaurantPageGet: (req, res) => {
        let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
        res.render(pages.RESTAURANT_PAGE, { userHeader: true, title: "restaurant", restaurant })
    },

    availableFoodGet: (req, res) => {
        let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
        res.render(pages.AVAILABLE_FOODS, { userHeader: true, title: "avaialble foods", restaurant })
    },

    paymentDetailsGet: (req, res) => {
        console.log(req.body);
        let restaurant = sample.filter((restaurant) => restaurant.id == req.params.restaurant_id)[0]
        res.render(pages.PAYMENT_DETAILS_PAGE, { userHeader: true, title: "payment details", restaurant })
    },

    wishListGet: (req, res) => {
        res.render(pages.WISHLIST_PAGE, { userHeader: true, title: "wishlist", cart: sample })
    }

    ,



    signupGet: (req, res) => {
        res.render(pages.SIGNUP_PAGE, { userHeader: true, title: "user signup", })
    },
    signupPost: async (req, res) => {
        try {
            const userStatus = user.find({ email: req.body?.email }).count()
            if (userStatus == 0) {
                const { confirm_password, ...rest } = req.body
                rest.password = await bcrypt.hash(req.body.password, SALT_ROUND)
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
            console.log(err);
        }
    },


    profileGet: (req, res) => {
        res.render(pages.PROFILE_PAGE, { userHeader: true, title: "Profile", })
    },
    searchProductsGet: (req, res) => {
        res.render(pages.SEARCH_PRODUCTS, { restaurants: sample })
    },
    changePasswordGet: (req, res) => {
        res.render(pages.CHANGE_PASSWORD, { userHeader: true, title: "Change password", restaurants: sample })
    }
    ,
    otpVerificationGet: (req, res) => {
        user.findOne({ _id: req.params.user_id }).then((user) => {
            res.render(pages.OTP_VERIFICATION, { userHeader: true, title: "OTP verification", otpCount: user.otp.expiredAt, userId: user._id })
        })
    },
    otpVerificationPost: async (req, res) => {
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
            console.log(err);
        }
    },
    ForgotPasswordGet: (req, res) => {
        res.render('user/forgotPassword', { userHeader: true })
    },
    ChangePasswordGet: (req, res) => {
        res.render("user/changePassword", { userId: req.params.user_id })
    },
    changePasswordPost: (req, res) => {
        bcrypt.hash(req.body.password, SALT_ROUND).then((hashedPassword) => {
            user.findByIdAndUpdate({ _id: req.params.user_id }, { $set: { "password": hashedPassword } }).then(() => {
                res.redirect("/login")
            })
        }).catch((err) => {
            console.log("err");
        })
    }
    ,
    verifyuserOtpPost: (req, res) => {
        console.log(req.body);
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
                        console.log("errr2");
                        res.redirect(`/forgot-password`)
                    }
                })
            })
        } catch (err) {
            console.log("err");
        }
    },

    sendOtpEmailPost: (req, res) => {
        try {
            user.findOne({ email: req.params.user_email }).then((userData => {
                generateUserOtp(userData._id).then((restaurant) => {
                    console.log(req.params.validation_type);
                    const emailTemplate = otpTextGenerator(restaurant.OTP, req.params.validation_type);
                    console.log(emailTemplate);
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