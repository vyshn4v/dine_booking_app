const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const categories_Schema = new Schema({
    category: String,
    visibility: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('categories', categories_Schema)