const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const Otp_schema = new Schema({
    createdAt: Date,
    expiredAt: Date,
    otp: String,

})
const Restaurant_Schema = new Schema({
    restaurant_name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: String,
    pincode: Number,
    table: Number,
    verified: {type:Boolean,default:false},
    status: { type: String, default: "active" },
    chair: String,
    location: {
        type: String,
        coordiantes: [{
            x: String,
            y: String
        }]
    },
    services: [{
        title: { type: String },
        description: { type: String }
    }],
    otp: { type: Otp_schema },
    menu: [{
        product_name: String,
        categories: Array,
        price: Number,
        stock: Number,
        product_image: String,
        description: String
    }],
    review: [{
        user_id: Schema.Types.ObjectId,
        review: String,
        star: Number,
        likes: Array,
        dislikes: Array,
    }]
})

module.exports = mongoose.model('restaurant', Restaurant_Schema)