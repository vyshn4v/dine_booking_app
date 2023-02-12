const mongoose = require("mongoose");

//mongoose connection to atlas

const dbConnection = () => {
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.MONGODB_URL, {
        dbName: "dine_booking_app"
    }).then(() => {
        console.log("database connected");
    }).catch(() => {
        console.log("database connection error");
    })
}

module.exports = dbConnection


