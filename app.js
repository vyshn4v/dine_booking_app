const express = require("express");
const app = express()
const https = require('https')
const fs = require('fs');
const path = require("path")
const port = process.env.PORT || 3000
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
    return (arg1 != arg2) ? options.inverse(this) : options.fn(this);
});
hbs.registerHelper('checkLength', function (v1, v2, options) {
    if (v1?.length > v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
hbs.registerHelper('prettifyDate', function (timestamp) {
    const date = new Date(timestamp)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime
});
hbs.registerHelper('Date', function (timestamp) {
    const date = new Date(timestamp)
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear()
    var strTime = day + '/' + month + '/' + year;
    return strTime
});
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
// cache control
app.use(noCache())

// express json config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/restaurant', restaurantRoute)
app.use('/admin', adminRoute)
app.use('/', userRoute)
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('internalError')
})
// port
if (process.env.WORKINGMODE === "DEV") {
    https.createServer({
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
    }, app).listen(port)
} else {
    app.listen(port, () => {
        console.log('server running on port ' + port);
    })
}