const User = require("../db/user.js");

module.exports.userSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
    }


module.exports.userSignUp=async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser= new User({email,username}); 
       const registeredUser = await User.register(newUser,password);
       console.log(registeredUser);
       req.login(registeredUser,((err)=>{  //Automatic log in after sign up
        if(err){
          return  next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
        
    }))
       
    }
    catch(err){
        console.log(err)
       req.flash("error",err.message);
       res.redirect("/signup");
       
    }
   
}

module.exports.userLoginForm   =  (req,res)=>{
    res.render("users/login.ejs");
} 


module.exports.userLogin = async(req,res)=>{

    try{
        let {username} = req.body;

        req.flash("success",`Welcome ${username}. You are logged in`);
        
      let redirectUrl = res.locals.redirectUrl || "/listings";
      
      
        res.redirect(redirectUrl);
    }
    catch(err){
        req.flash("error",err.message);
        
        
     }
    
   
}

module.exports.userLogOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}