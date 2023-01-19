const express=require("express");
const env=require("dotenv")
const app=express()
const path=require("path")
const port=3000
const userRoute=require('./routes/user')
const hbs=require('hbs')



//set view directory to public
app.set('views',path.join(__dirname,'views'))

//setup public folder
app.use(express.static(path.join(__dirname,"public")))

//setting view engine as hbs
app.set('view engine','hbs')

//setting up hbs partials
hbs.registerPartials(__dirname+"/views/partials")

app.use('/',userRoute)

app.listen(port,()=>{
    console.log("server started on port number "+port);
})