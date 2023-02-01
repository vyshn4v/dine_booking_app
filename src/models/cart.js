const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const order_Schema = new Schema({
    restaurant_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    products: [{
        quantity: Number,
        product_id: mongoose.Schema.Types.ObjectId
    }],
    tables: [
        {
            tables_count: Number,
            table_id: mongoose.Schema.Types.ObjectId
        }
    ],
    status: String
})

module.exports = mongoose.model('orders', order_Schema)