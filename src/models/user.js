const mongoose=require('mongoose')
const { Schema } = mongoose;

const Users_Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, require: true, default: null },
    password: { type: String, require: true },
    profile_pic: { type: String, default: null },
    verified: { type: Boolean, default: false },
    status: { type: String, default: "active" },
});

module.exports = mongoose.model('users', Users_Schema)
// orders: [
//     {
//         restaurant_id: ObjectId,
//         profucts: [{
//             quantity: Number,
//             product_id: ObjectId
//         }],
//         table: Number,
//         chair: Number,
//         status: String
//     }
// ]