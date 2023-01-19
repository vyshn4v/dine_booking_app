const router=require('express').Router()
//pages
const pages={
    userHome:"user/home"
}
const{userHome}=pages
router.get('/',(req,res)=>{
    res.render(userHome,{title:"home",restaurants:[{},{},{},{},{},{}]})
})

module.exports=router