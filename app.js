const express = require("express");
const env = require("dotenv")
const app = express()
const path = require("path")
const port = 3000
const { DATABASE_URL }=require('./src/config/config.moongoose')
const userRoute = require('./src/routes/user')
const restaurantRoute = require('./src/routes/restaurant')
const adminRoute = require('./src/routes/admin')
const hbs = require('hbs');
const mongoose = require("mongoose");



//set view directory to public
app.set('views', path.join(__dirname, '/src/views'))

//mongoose connection to atlas
mongoose.set('strictQuery', true)
mongoose.connect(DATABASE_URL,{
    dbName:"dine_booking_app"
}).then(()=>{
    console.log("database connected");
}).catch(()=>{
    console.log("database connection error");
})

//setup public folder
app.use(express.static(path.join(__dirname, "/src/public/")))

//setting view engine as hbs
app.set('view engine', 'hbs')

//setting up hbs partials
hbs.registerPartials(__dirname + "/src/views/partials")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', userRoute)
app.use('/restaurant', restaurantRoute)
app.use('/admin', adminRoute)

app.listen(port, () => {
    console.log("server started on port number " + port);
})