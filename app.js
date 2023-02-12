const express = require("express");
const app = express()
const path = require("path")
const port = 3000
const userRoute = require('./src/routes/user')
const restaurantRoute = require('./src/routes/restaurant')
const adminRoute = require('./src/routes/admin')
const hbs = require('hbs');
const cookieParser = require('cookie-parser')
const noCache = require('nocache')

//setup public folder
app.use(express.static(path.join(__dirname, "/src/public/")))

const session = require('express-session');
const dbConnection = require("./src/config/dbConnection");
const { cloudinaryConfig } = require("./src/config/cloudinary");
//dot env config
require('dotenv').config()
// clodinary configuration
app.use(cloudinaryConfig)
//session configuration
app.use(cookieParser())
app.set('trust proxy', 1)
app.use(session({
    resave: false,
    secret: process.env.SESSION_SECRET,//from dot env file
    saveUninitialized: true,
    cookie: { expires: 259200 }
}))


//set view directory to public
app.set('views', path.join(__dirname, '/src/views'))
//mongodb connection
dbConnection()
//setting view engine as hbs
app.set('view engine', 'hbs')
//setting up hbs partials
hbs.registerPartials(__dirname + "/src/views/partials")

//setting up  hbs helper
hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('checklength', function (v1, v2, options) {
    if (v1.length > v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
// cache control
app.use(noCache())

// express json config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/restaurant', restaurantRoute)
app.use('/admin', adminRoute)
app.use('/', userRoute)

// port
app.listen(process.env.PORT || port, () => {
    console.log("server started on port number " + port);
})