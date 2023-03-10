const restaurant = require("../models/restaurant");
const bcrypt = require('bcrypt');
const generateRestaurantOtp = require("../helpers/generatOtpRestaurant");
const sendOtpViaMail = require("../helpers/sendOtpMail");
const otpTextGenerator = require("../helpers/generateOtpText");
const user = require("../models/user");
const generateUserOtp = require("../helpers/generateUserOtp");
//admin authentication
const
    adminLoginGet = (req, res, next) => {
        try {
            res.render("admin/login", { adminHeader: true, err: req.session.err })
            req.session.err = null
        } catch (err) {
            next(err)
        }
    },
    adminLoginPost = (req, res) => {
        const Admin = {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        }
        console.log(req.body);
        if (req.body.email === Admin.email && req.body.password === Admin.password) {
            req.session.admin = {
                admin: true,
            }
            res.redirect('/admin/dashboard')
        } else {
            req.session.err = "password or email not matched"
            res.redirect('/admin/login')
        }

    },
    adminLogoutGet = (req, res) => {
        req.session.admin = null
        res.redirect("/admin/login")
    },
    getRestaurantLogin = (req, res) => {
        res.render("restaurant/login", { restaurantHeader: true, err: req.session.err })
    }
    ,
    postRestaurantLogin = (req, res, next) => {
        try {
            console.log(req.body);
            restaurant.findOne({ email: req.body.email }).then((restaurantData) => {
                if (restaurantData) {
                    bcrypt.compare(req.body.password, restaurantData.password).then((status) => {
                        if (status) {
                            generateRestaurantOtp(restaurantData._id).then((restaurant) => {
                                const otpText = otpTextGenerator(restaurant.OTP, "welcome-back")
                                sendOtpViaMail(otpText, restaurant.email).then((status) => {
                                    res.redirect(`/restaurant/${restaurant._id}/validate-otp/2-factor`)
                                }).catch((status) => {
                                    throw "false"
                                })
                            }).catch(() => {
                                console.log("err1");
                            })
                        }
                        else {
                            req.session.err = "password not matched"
                            res.redirect('/restaurant/login')
                        }
                    })
                } else {
                    req.session.err = "user not found"
                    res.redirect('/restaurant/login')
                }
            }).catch(() => {
                req.session.err = "user not found"
                res.redirect('/restaurant/login')
            })
        } catch (err) {
            next(err)
        }
    },
    //signup
    getRestaurantSignup = (req, res) => {
        const error = req.session.err
        req.session.err = null
        res.render("restaurant/signup", { restaurantHeader: true, err: error })
    },
    postRestaurantSignup = async (req, res) => {
        try {
            const { confirm_password, ...rest } = req.body
            rest.password = await bcrypt.hash(rest.password, parseInt(process.env.SALT_ROUND))
            const Restaurant = new restaurant(rest)
            const savedRestaurant = await Restaurant.save()
            generateRestaurantOtp(savedRestaurant._id).then((restaurant) => {
                const otpText = otpTextGenerator(restaurant.OTP, "verify-profile")
                console.log("restaurant");
                sendOtpViaMail(otpText, restaurant.email).then((status) => {

                    console.log("working");
                    res.redirect(`${restaurant._id}/validate-otp/verify-profile`)
                }).catch((status) => {
                    console.log(status);
                    throw "false"
                })
            }).catch(() => {
                console.log("err1");
            })
        } catch (err) {
            next(err)
        }
    },
    // Get render otp validation page
    getOtpTwoFactorPage = async (req, res, next) => {
        restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
            console.log("restaurantData" + restaurantData);
            const response = {
                otpCount: restaurantData.otp.expiredAt,
                restaurantId: restaurantData._id,
                restaurantEmail: restaurantData.email,
                err: req.session.err
            }
            req.session.err = null;
            res.render("restaurant/twofactorvalidation", response)
        }).catch((err) => {
            next(err)
        })
    },
    getOtpPage = async (req, res) => {
        restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
            console.log("restaurantData" + restaurantData);
            const response = {
                err: req.session.err,
                restaurantHeader: true,
                otpCount: restaurantData.otp.expiredAt,
                restaurantId: restaurantData._id,
                restaurantEmail: restaurantData.email
            }
            res.render("restaurant/otpValidation", response)
        })
    },
    postSendOtpEmail = async (req, res) => {
        try {
            restaurant.findOne({ email: req.params.restaurant_email }).then((restaurantData => {
                generateRestaurantOtp(restaurantData._id).then((restaurant) => {
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
    deleteAccount = async (req, res) => {
        try {
            restaurant.findOne({ _id: req.params.restaurant_id }).then((restaurantData => {
                bcrypt.compare(req.body.password, restaurantData.password).then((status) => {
                    if (status) {
                        restaurant.deleteOne({ _id: restaurantData._id })
                    } else {
                        req.session.err = "password err"
                        res.redirect('/restaurant/profile')
                    }
                })
            })).catch(() => {
                req.session.err = "user not found"
                res.redirect('/restaurant/profile')
            })
        } catch (err) {
            res.json({ status: false, message: "something went wrong" })
        }
    },
    postverifyRestaurantOtp = (req, res, next) => {
        try {
            restaurant.findOne({ email: req.body.email }).then((restaurantData) => {
                let expired = new Date(restaurantData.otp.expiredAt)
                let currentDate = new Date();
                bcrypt.compare(req.body.otp, restaurantData.otp.otp).then((status) => {
                    if (status && expired > currentDate) {
                        restaurant.findByIdAndUpdate({ _id: restaurantData._id }, { $set: { "otp.otp": "" } }, { new: true }).then((restaurantDataUpdated) => {
                            res.redirect(`/restaurant/change-password/${restaurantDataUpdated._id}`)
                        })
                    } else {
                        res.redirect(`/restaurant/forgot-password`)
                    }
                })
            })
        } catch (err) {
            next(err)
        }
    },

    //user authentication

    //login

    getLogin = (req, res, next) => {
        try {
            res.render("user/login", { title: "user login", err: req.session.err })
            req.session.err = null;
        } catch (err) {
            next(err)
        }
    },
    //signup
    postLogin = (req, res, next) => {
        try {
            user.findOne({ email: req.body.email }).then((userDetails) => {
                bcrypt.compare(req.body.password, userDetails.password).then((status) => {
                    if (status) {
                        req.session.user = {
                            userId: userDetails._id,
                            email: userDetails.email,
                            email_verification: userDetails.verified,
                            profile_completed: userDetails.profile_completed
                        }
                        res.redirect('/')
                    } else {
                        res.redirect('/login')
                    }
                }).catch(() => {
                    res.redirect('/login')
                })
            }).catch(() => {
                res.redirect('/login')
            })
        } catch (err) {
            next(err)
        }
    },
    getLoginWithOtp = (req, res) => {
        res.render('user/loginWithOtp', { userHeader: true, title: "user login", err: req.session.err })
        req.session.err = null;
    },
    postLoginWithOtp = (req, res, next) => {
        try {
            user.findOne({ email: req.body.email }).then((userData) => {
                if (userData) {
                    generateUserOtp(userData._id).then((user) => {
                        const otpText = otpTextGenerator(user.OTP, "welcome-back")
                        sendOtpViaMail(otpText, user.email).then((status) => {
                            res.redirect(`/${user._id}/validate-otp/2-factor`)
                        }).catch((status) => {
                            throw "false"
                        })
                    }).catch((err) => {
                        next(err)
                    })
                } else {
                    req.session.err = "user not found"
                    res.redirect('/login-with-otp')
                }
            }).catch(() => {
                req.session.err = "user not found"
                res.redirect('/login-with-otp')
            })
        } catch (err) {
            next(err)
        }
    },
    //two factor
    getTwoFactor = (req, res, next) => {
        try {
            user.find({ _id: req.params.user_id }).then((userData) => {
                console.log(userData);
                res.render('user/twoFactor', { userId: req.params.user_id, otpCount: userData[0].otp?.expiredAt, restaurantId: userData[0]._id })
            })
        } catch (err) {
            next(err)
        }
    },
    postTwoFactor = (req, res, next) => {
        try {
            user.findOne({ _id: req.params.user_id }).then((userData) => {
                console.log(userData);
                let expired = new Date(userData.otp.expiredAt)
                let currentDate = new Date();
                bcrypt.compare(req.body.otp, userData.otp.otp).then((status) => {
                    if (status && expired > currentDate) {
                        user.findByIdAndUpdate({ _id: userData._id }, { $set: { "otp.otp": "" } }, { new: true }).then((userDataUpdated) => {
                            req.session.user = {
                                userId: userDataUpdated._id,
                                email: userDataUpdated.email,
                                email_verification: userDataUpdated.verified
                            }
                            res.redirect('/')
                        })
                    } else {
                        res.redirect(`/restaurant/login-with-otp`)
                    }
                })
            })
        } catch (err) {
            next(err)
        }
    },
    userLogout = (req, res) => {
        req.session.user = null;
        res.redirect('/login')
    }
module.exports = {
    adminLoginGet,
    adminLoginPost,
    adminLogoutGet,
    getRestaurantLogin,
    postRestaurantLogin,
    getRestaurantSignup,
    postRestaurantSignup,
    getOtpTwoFactorPage,
    getOtpPage,
    postSendOtpEmail,
    deleteAccount,
    postverifyRestaurantOtp,
    getLogin,
    postLogin,
    getLoginWithOtp,
    getTwoFactor,
    postTwoFactor,
    postLoginWithOtp,
    userLogout
}