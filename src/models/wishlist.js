const mongoose = require('mongoose')
const { Schema } = mongoose;

const wish_list_Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId },
    products: { type: Array, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('wishlist', wish_list_Schema)