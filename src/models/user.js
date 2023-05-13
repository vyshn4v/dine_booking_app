const mongoose = require('mongoose')
const { Schema } = mongoose;
const Otp_schema = new Schema({
    createdAt: Date,
    expiredAt: Date,
    otp: String,

})
const Profile_pic = new Schema({
    url: String,
    public_key: String
})
const Location_schema = new Schema({
    type: { type: String, default: "Point" },
    coordinates: { type: Array }
})
const Users_Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, require: true, default: null },
    password: { type: String, require: true },
    profile_pic: { type: Profile_pic },
    verified: { type: Boolean, default: false },
    status: { type: String, default: "active" },
    otp: { type: Otp_schema },
    location: { type: Location_schema }
}, { timestamps: true });

module.exports = mongoose.model('users', Users_Schema)