const express =require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const Listing = require("../db/listing");
// const Listing = require("./db/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Reviews = require("../db/review");
const ListingController = require("../Controllers/listing.js");
const multer = require('multer');
const { storage, cloudinary } = require("../cloudConfig");

const upload = multer({storage});







const validateListing = (req,res,next)=>{

    let result = listingSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el)=> el.message).join(",");
        console.log(result.error)
     throw new ExpressError(400,errMsg);
    }else{
        next()
    }
}
const isLoggedIn = (req,res,next)=>{
    console.log("logger");
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

const isOwner= async (req,res,next)=>{
    const { id } = req.params;
    console.log("owner");
     let listing =await  Listing.findById(id);
    
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of the listing");
            res.redirect(`/listings/${id}`);
          }
    
          
          next();
        }

router.route("/")
.get( ListingController.index )
.post( isLoggedIn, upload.single("listing[image]"), validateListing, ListingController.createListing);
 

// New Route
router.get("/new",isLoggedIn, ListingController.renderNewForm)                                         // keep listing/:id below so that it get the params of string

router.route("/:id")
//Show Route
.get( ListingController.showListing)
//Update Route
.put( isLoggedIn,isOwner, validateListing, ListingController.updateListing);






//Edit
router.get("/:id/edit",isLoggedIn,isOwner, ListingController.editListing)



router.delete("/:id/delete", isLoggedIn, isOwner, ListingController.deleteListing)



module.exports=router;