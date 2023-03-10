const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const Otp_schema = new Schema({
    createdAt: Date,
    expiredAt: Date,
    otp: String,

})
const profile_image = new Schema({
    url: String,
    public_key: String
})
const Restaurant_Schema = new Schema({
    restaurant_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    profile_pic: [
        {
            public_id: { type: String },
            url: { type: String }
        }
    ],
    phone: { type: String, default: null },
    pincode: Number,
    profile_completed: { type: Boolean, default: false },
    description: String,
    gst_number: String,
    pan_number: String,
    opening_time: Date,
    closing_time: Date,
    verified: { type: Boolean, default: false },
    status: { type: String, default: "pending" },
    location: {
        type: String,
        coordiantes: [{
            x: String,
            y: String
        }]
    },
    services: [{
        title: { type: String },
    }],
    otp: { type: Otp_schema },
    menu: [{
        product_name: { type: String },
        category: Schema.Types.ObjectId,
        price: Number,
        stock: Number,
        status: { type: Boolean, default: true },
        product_image: String,
    }],
    tables: [{
        table_number: String,
        chair: Number,
        table: Number,
        booked: { type: Boolean, default: false },
        air_conditioned: { type: String }
    }]
}, { timestamps: true })
Restaurant_Schema.plugin(mongoosePaginate)
module.exports = mongoose.model('restaurant', Restaurant_Schema)