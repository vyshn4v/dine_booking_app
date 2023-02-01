const restaurant = require("../models/restaurant");
const bcrypt = require('bcrypt');
const generateRestaurantOtp = require("../helpers/generatOtpRestaurant");
const sendOtpViaMail = require("../helpers/sendOtpMail");
const otpTextGenerator = require("../helpers/generateOtpText");
const user = require("../models/user");
//admin authentication
const postAdminLogin = (req, res) => {
    const Admin = {
        email: "admin@gmail.com",
        password: "123456"
    }
    console.log(req.body);
    if (req.body.email === Admin.email && req.body.password === Admin.password) {
        res.redirect('/admin/dashboard')
    } else {
        res.redirect('admin/login')
    }
}

//restaurant Authentication

//login
const getRestaurantLogin = (req, res) => {
    res.render("restaurant/login", { restaurantHeader: true })
}

const postRestaurantLogin = (req, res) => {
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
                        req.session.err="password not matched"
                        res.redirect('/restaurant/login')
                    }
                })
            } else {

                req.session.err="user not found"
                res.redirect('/restaurant/login')
            }
        }).catch(()=>{
            req.session.err="user not found"
            res.redirect('/restaurant/login')
        })
    } catch (err) {
        console.log(err);
    }
}
//signup
const getRestaurantSignup = (req, res) => {
    res.render("restaurant/signup", { restaurantHeader: true, err: req.session.err })
    req.session.err = null
}

const postRestaurantSignup = async (req, res) => {
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
        console.log(err);
    }
}
// Get render otp validation page
const getOtpTwoFactorPage = async (req, res) => {
    restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
        console.log("restaurantData");
        const response = {
            restaurantHeader: true,
            otpCount: restaurantData.otp.expiredAt,
            restaurantId: restaurantData._id,
            restaurantEmail: restaurantData.email,
            err: req.session.err
        }
        req.session.err = null;
        res.render("restaurant/2factorValidation", response)
    })
}
const getOtpPage = async (req, res) => {
    restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
        console.log(restaurantData);
        const response = {
            err: req.session.err,
            restaurantHeader: true,
            otpCount: restaurantData.otp.expiredAt,
            restaurantId: restaurantData._id,
            restaurantEmail: restaurantData.email
        }
        res.render("restaurant/otpValidation", response)
    })
}
const postSendOtpEmail = async (req, res) => {
    try {
        restaurant.findOne({ email: req.params.restaurant_email }).then((restaurantData => {
            generateRestaurantOtp(restaurantData._id).then((restaurant) => {
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
}
const deleteAccount = async (req, res) => {
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
}
//verify forgot password
const postverifyRestaurantOtp = (req, res) => {
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
        console.log("err");
    }
}

//user authentication

//login

const getLogin = (req, res) => {
    res.render("user/login", { userHeader: true, title: "user login", err: req.session.err })
    req.session.err = null;
}
//signup
const postLogin = (req, res) => {
    try {
        console.log(req.body);
        user.findOne({ email: req.body.email }).then((userDetails) => {
            bcrypt.compare(req.body.password, userDetails.password).then((status) => {
                if (status) {
                    req.session.user = {
                        userId: userDetails._id,
                        email: userDetails.email,
                        email_verification: userDetails.verified
                    }
                    res.redirect('/')
                }
                else {
                    res.redirect('/login')
                }
            })
        })
    } catch (err) {
        console.log(err);
    }
}
//two factor
const getTwoFactor = (req, res) => {
    res.render()
}

const postTwoFactor = () => {

}
//forgot password
module.exports = {
    //admin
    postAdminLogin,
    //restaurant
    //login
    getRestaurantLogin,
    postRestaurantLogin,
    deleteAccount,
    //signup
    getRestaurantSignup,
    postRestaurantSignup,
    //forgot password
    postverifyRestaurantOtp,
    // otp
    getOtpPage,
    getOtpTwoFactorPage,
    postSendOtpEmail,
    // get2FOtpPage,
    // postSend2FOtpEmail,
    //user
    getLogin,
    postLogin,
    //two factor
    getTwoFactor
}