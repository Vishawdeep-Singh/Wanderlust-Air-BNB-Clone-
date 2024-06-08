const express =require("express");
const router = express.Router({mergeParams:true});

const mongoose = require("mongoose");
const Listing = require("../db/listing");
// const Listing = require("./db/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/expressError");
const { listingSchema, reviewSchema } = require("../schema");
const Reviews = require("../db/review");
const ReviewsController = require("../Controllers/review.js")

const validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el)=> el.message).join(",")
     throw new ExpressError(400,errMsg);
    }else{
        next()
    }
    
}
const isLoggedIn = (req,res,next)=>{
    // console.log("logger");
    // console.log(req.path,"..",req.originalUrl); // This is for we redirect at where we come from
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl =  req.originalUrl; // After login success passport empties the req.session so we store it in locals

        req.flash("error","Login before create Listing");
        res.redirect("/login");
            }
            else{
                next()
            }
           
}

const isAuthor= async (req,res,next)=>{
    const { id,revId } = req.params;
   
     let review =await  Reviews.findById(revId);
    
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You did not create this review");
           return res.redirect(`/listings/${id}`);
          }
    
          
          next();
        }

router.post("/", isLoggedIn, validateReview, ReviewsController.createReview )
 
 
 router.delete("/:revId",isLoggedIn, isAuthor, ReviewsController.deleteReview)
 
 
 
 module.exports = router