const Listing = require("../db/listing");
const Reviews = require("../db/review");

module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`)
     
 
 }


 module.exports.deleteReview = async (req,res)=>{
    let {id , revId} = req.params;

    try{
        await Listing.findByIdAndUpdate(id,{$pull : {reviews:revId}})
        await Reviews.findByIdAndDelete(revId);
    }
    catch(err){
        console.log("Error in deleting review")
    }
    res.redirect(`/listings/${id}`);

}