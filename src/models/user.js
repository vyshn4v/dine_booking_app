const mongoose = require('mongoose')
const { Schema } = mongoose;
const Otp_schema = new Schema({
    createdAt: Date,
    expiredAt: Date,
    otp: String,

})
const Users_Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, require: true, default: null },
    password: { type: String, require: true },
    profile_pic: { type: String, default: null },
    verified: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    otp: { type: Otp_schema },
}, { timestamps: true });

module.exports = mongoose.model('users', Users_Schema)