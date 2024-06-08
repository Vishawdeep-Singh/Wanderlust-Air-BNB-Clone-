if(process.env.Node_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./db/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const e = require("express");
const  Reviews  = require("./db/review");
const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/review.js");
const usersRouter = require("./Routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =  require("passport");
const LocalStrategy = require("passport-local");
const User = require("./db/user.js");





async function main1() {
    await mongoose.connect(process.env.MONGOURL)
}
main1().then(() => {
    console.log("connected to DB");

}).catch((err) => {
    console.log(err);
})





app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({ 
    mongoUrl: process.env.MONGOURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600



})

// store.on("error",()=>{
// console.log("Error in MongoSession Store",err)
// })
const sessionOptions = {
    store:store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true
    }
}


app.use(session(sessionOptions));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()
  ));
  passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})










app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter) // So that :id param not only limited or access to use in app.js , it can be used in other pages or go further into our routes we use "merge params".
app.use("/",usersRouter);
//index route


























app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})
app.use((err, req, res, next) => {
    let { statusCode = "500", message = "Something went wrong" } = err;
    res.render("error.ejs", { message })
})
app.listen(8080, () => {
    console.log("Listening")
})
