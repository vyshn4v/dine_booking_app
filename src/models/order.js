const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const order_Schema = new Schema({
    restaurant_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    products: [{
        quantity: Number,
        product_id: mongoose.Schema.Types.ObjectId
    }],
    tables: Array,
    date: Date,
    time: Date,
    guestName: { type: String, default: null },
    guestPhone: { type: String, default: null },
    totalHead: Number,
    status: { type: String, default: "pending" },
    total_price: Number,
    razor_pay_order_id: String
}, { timestamps: true })

module.exports = mongoose.model('orders', order_Schema)