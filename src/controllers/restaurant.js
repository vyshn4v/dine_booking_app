const restaurant = require("../models/restaurant")
const bcrypt = require('bcrypt')

const sendOtpViaMail = require("../helpers/sendOtpMail");
const generateRestaurantOtp = require("../helpers/generatOtpRestaurant");
const { sample } = require("../sampledata/sample");
const fs = require('fs');
const user = require("./user");
const category = require("../models/category");
const { dataUri } = require("../helpers/imagepload");
const { uploader } = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");
// const { promisfy } = require('util')
// const unlinkAsync = promisfy(fs.unlink)
module.exports = {
    viewOrdersGet: (req, res) => {
        restaurant.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.session.restaurant.restaurantId) } },
            { $unwind: "$menu" }, {
                $lookup: {
                    from: 'categories',
                    localField: "menu.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $project: {
                    menu: 1,
                    category: 1
                }
            }
        ]).then((dishes) => {
            console.log(dishes);
            res.render("restaurant/products", { restaurantHeader: true, title: "orders", cart: sample, restaurant: true, products: dishes })
        })
    }

    ,
    OtpVerificationPost: async (req, res) => {
        try {
            restaurant.findById({ _id: req.params.restaurant_id }).then((restaurantData) => {
                let expired = new Date(restaurantData.otp.expiredAt)
                let currentDate = new Date();
                if (req.params.validation_type === "2-factor") {
                    bcrypt.compare(req.body.otp, restaurantData.otp.otp).then((status) => {

                        if (status && expired > currentDate) {
                            restaurant.findByIdAndUpdate({ _id: restaurantData._id }, { $set: { "otp.otp": "" } }, { new: true }).then((restaurantnew) => {
                                console.log("restaurantData verifeid");
                                // req.session.restaurant = {
                                //     restaurantId: restaurantnew._id,
                                //     restaurantEmail: restaurantnew.email
                                // }
                                req.session.restaurant = {
                                    restaurantId: restaurantnew._id,
                                    restaurantEmail: restaurantnew.email,
                                    verified: restaurantnew.verified,
                                    profile_verified: restaurantnew.profile_completed
                                }
                                res.redirect('/restaurant/view-orders')

                            }).catch(() => {
                                req.session.err = "otp validation error"
                                res.redirect(`/restaurant/${req.params.restaurant_id}/validate-otp/2-factor`)
                            })
                        } else {
                            req.session.err = "otp validation error"
                            res.redirect(`/restaurant/${req.params.restaurant_id}/validate-otp/2-factor`)
                        }
                    })
                } else {
                    bcrypt.compare(req.body.otp, restaurantData.otp.otp).then((status) => {
                        if (status && expired > currentDate) {
                            restaurant.findByIdAndUpdate({ _id: restaurantData._id }, { $set: { "verified": true, "otp.otp": "" } }, { new: true }).then((restaurantnew) => {
                                res.redirect('/restaurant/view-orders')
                            })
                        } else {
                            req.session.err = "otp validation error"
                            res.redirect(`/restaurant/${req.params.restaurant_id}/validate-otp/verify-profile`)
                        }
                    })
                }
            })
        } catch (err) {
            console.log(err);
        }
    }


    ,


    validateOtp: (req, res) => {
        // console.log(req.body);
    },

    viewProductsGet: (req, res) => {
        res.render("restaurant/products", { restaurantHeader: true, restaurant: true })
    },
    showProfileGet: (req, res) => {
        console.log(req.session.restaurant.restaurantId);
        restaurant.findById({ _id: req.session.restaurant.restaurantId }).then((restaurantData) => {
            console.log(restaurantData);
            const data = {
                restaurantHeader: true,
                restaurant: restaurantData,
                err: req.session?.err
            }
            req.session.err = null
            res.render("restaurant/profile", data)
        })
    },
    tableManagementGet: (req, res) => {
        console.log(req.session.restaurant.restaurantId);
        restaurant.findById({ _id: req.session.restaurant.restaurantId }, { tables: 1 }).then((tables) => {
            const data = {
                restaurantHeader: true,
                tables: tables.tables,
                err: req.session?.err
            }
            req.session.err = null
            res.render("restaurant/tables", data)
        })
    },
    saveProfilePost: (req, res) => {
        const { password, ...rest } = req.body
        // console.log(req.body);
        try {

            restaurant.findById({ _id: req.session.restaurant.restaurantId }).then((restaurantData) => {
                bcrypt.compare(password, restaurantData.password).then(async (status) => {
                    if (status) {
                        let image = []
                        if (req.files) {
                            for (let i = 0; i < req.files.length; i++) {
                                const file = await dataUri(req.files[i]).content
                                await uploader.upload(file).then(async (result) => {
                                    await restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId }, { $push: { profile_pic: { "public_id": result.public_id, "url": result.url } } })
                                })
                            }
                        }
                        restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId }, { $set: { ...rest, profile_completed: true } }).then(async (updatedData) => {
                            if (req.files) {
                                if (restaurantData.profile_pic?.public_key) {
                                    await uploader.destroy(restaurantData.profile_pic?.public_key)
                                }
                            }
                            res.redirect("/restaurant/profile")
                        })
                    } else {
                        req.session.err = "password is not matched"
                        res.redirect("/restaurant/profile")
                    }
                })
            })
        } catch (err) {
            res.send(err)
        }
    },
    saveTablePost: (req, res) => {
        console.log(req.body);
        const table = {
            chair: req.body.total_chair,
            tables: req.body.total_table,
        }
        console.log(table);
        restaurant.findById({
            _id: req.session.restaurant.restaurantId, "tables": {
                $in: { "chair": parseInt(req.body.total_chair) }
            }
        }).then((restaurantDetails) => {
            console.log(restaurantDetails);
            let flag = 0;
            bcrypt.compare(req.body.password, restaurantDetails.password).then((status) => {
                if (status) {
                    restaurantDetails.tables?.map((table, index) => {
                        if (table.chair === req.body.total_chair) {
                            flag = 1
                        }
                    })
                    if (flag === 1) {
                        restaurant.updateOne({ _id: req.session.restaurant.restaurantId, "tables.chair": parseInt(req.body.total_chair) }, { $set: { "tables.$.table": parseInt(req.body.total_table) } }, { new: true }).then((restaurantnew) => {
                            res.redirect("/restaurant/profile")
                        })
                    } else {
                        restaurant.updateOne({ _id: req.session.restaurant.restaurantId }, {
                            $push: { tables: { "chair": parseInt(req.body.total_chair), "table": parseInt(req.body.total_table) } }
                        }).then((restaurantnew) => {
                            console.log(restaurantnew);
                            res.redirect("/restaurant/profile")
                        })
                    }
                } else {
                    req.session.err = "password not matched"
                    res.redirect('/restaurant/profile')
                }
            })
        })
        // restaurant.updateOne(
        //     {
        //         "_id": req.session.restaurant.restaurantId,
        //         "tables.chair": Number(req.body.total_chair)
        //     }
        //     , {
        //         $Set: {
        //             "tables.$.chair": Number(req.body.total_chair),
        //             "tables.$.table": Number(req.body.total_table)
        //         }
        //     }, { upsert: true }
        // ).then((restaurantData) => {
        //     console.log(restaurantData);
        // })
    },
    deleteTablePost: (req, res) => {
        console.log(req.params);
        restaurant.updateOne({ "_id": req.session.restaurant.restaurantId }, { $pull: { "tables": { "_id": req.params.table_id } } }).then((response) => {
            if (response.modifiedCount > 0) {
                res.json({ status: true, message: "table deleted successfully" })
            } else {
                res.json({ status: false, message: "table not deleted" })
            }
        }).catch(() => {
            res.json({ status: false, message: "table not deleted" })
        })
    },
    addProductGet: async (req, res) => {
        const Category = await category.find()
        console.log(req.body);
        res.render("restaurant/addProduct", { restaurantHeader: true, restaurant: true, Category })
    },
    addProductPost: async (req, res) => {
        try {
            const file = await dataUri(req.file).content
            await uploader.upload(file).then((result) => {
                req.body.category = mongoose.Types.ObjectId(req.body.category)
                let productData = {
                    ...req.body, product_image: result.url
                }
                restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId }, { $push: { menu: { ...productData } } }).then(() => {
                    res.redirect('/restaurant/add-products');
                }).catch(() => {
                    res.redirect('/restaurant/add-products');
                })
            })
        } catch (err) {
            console.log(err.message);
        }
    },
    addServiceGet: (req, res) => {
        console.log(req.body);
        restaurant.find({ _id: req.session.restaurant.restaurantId }, { services: 1 }).then((services) => {
            res.render("restaurant/addService", { restaurantHeader: true, restaurant: true, services: services[0].services })
        })
    },
    addServicePost: (req, res) => {
        console.log(req.body);
        let flag = 0;
        restaurant.find({ _id: req.session.restaurant.restaurantId }).then((restaurants) => {
            console.log(restaurants);
            restaurants.services?.map((service, index) => {
                if (service?.title === req.body?.title) {
                    flag = 1
                }
            })
            if (flag == 1) {
                restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId, "services.title": req.body?.title }, { $set: { "services.$.description": req.body.description } }, { new: true }).then((services) => {
                    res.redirect('/restaurant/add-service')
                })
            } else {
                restaurant.findByIdAndUpdate({ _id: req.session.restaurant.restaurantId }, { $push: { "services": { ...req.body } } }, { new: true }).then((services) => {
                    res.redirect('/restaurant/add-service')
                })
            }
        })
    },

    signupGet: (req, res) => {
        res.render("restaurant/login", { restaurantHeader: true, restaurant: true })
    },


    forgotPasswordGet: (req, res) => {
        res.render('restaurant/forgotPassword', { restaurantHeader: true, restaurant: true })
    },
    changePasswordGet: (req, res) => {
        res.render('restaurant/changePassword', { restaurantHeader: true, restaurantId: req.params.restaurant_id, restaurant: true })
    },
    changePasswordPost: (req, res) => {
        bcrypt.hash(req.body.password, process.env.SALT_ROUND).then((hashedPassword) => {
            restaurant.findByIdAndUpdate({ _id: req.params.restaurant_id }, { $set: { "password": hashedPassword } }).then(() => {
                req.session.err = "password changed successfully"
                res.redirect("/restaurant/login")
            })
        }).catch((err) => {
            console.log("err");
        })
    },
    changePasswordviaProfilePost: (req, res) => {
        console.log(req.body);
        restaurant.findById({ _id: req.session.restaurant.restaurantId }).then((restaurantDetails) => {
            bcrypt.compare(req.body.currentPassword, restaurantDetails.password).then((status) => {
                if (status) {
                    bcrypt.hash(req.body.newPassword, Number(process.env.process.env.SALT_ROUND)).then((hashedPassword) => {
                        console.log(hashedPassword);
                        restaurant.findByIdAndUpdate({ _id: req.params.restaurant_id }, { $set: { "password": hashedPassword } }).then(() => {
                            req.session.err = "password changed successfully"
                            req.session.restaurant = null;
                            res.redirect("/restaurant/login")
                        })
                    }).catch((err) => {
                        console.log("err");
                    })
                }
            })
        })
    },
    restaurantLogout: (req, res) => {
        req.session.restaurant = null;
        res.redirect('/restaurant/login')
    }

}