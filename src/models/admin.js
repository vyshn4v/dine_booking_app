const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const admin_Schema = new Schema({
    email: { type: String, required: true, default: "admin@gmail.com" },
    password: { type: String, required: true, default: "365411" },
})

module.exports = mongoose.model('admin', admin_Schema)