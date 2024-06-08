const express =require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../db/user.js");
const UserController = require("../Controllers/user.js")







const saveRedirectUrl = (req,res,next)=>{
   if (req.session.redirectUrl) {
    res.locals.redirectUrl=req.session.redirectUrl;
   
   } 
   next();
}













router.get("/signup",UserController.userSignUpForm);

router.post("/signup",UserController.userSignUp);

router.get("/login",UserController.userLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),UserController.userLogin)


router.get("/logout",UserController.userLogOut)
module.exports=router;
