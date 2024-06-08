const Listing = require("../db/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken})


module.exports.index=async (req, res) => {
    let allListings = await Listing.find({})

    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    
    res.render("listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}
module.exports.createListing = async (req, res) => {
   let response1 = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send()

       
        
    let url =  req.file.path;
    let filename = req.file.filename;
    try {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing")
        }
       
        let listing = req.body.listing;
       
        const response = await Listing.findOne(listing);
        if (!response) {
            const newListing = new Listing(listing);
            newListing.owner=req.user._id;
            newListing.geometry=response1.body.features[0].geometry;
            newListing.image={url,filename};
            await newListing.save();
          
            
           
            req.flash("success", "New Listing created");
            res.redirect("/listings");
        } else {
            res.status(409).json({
                msg: "Already exist"
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Problem in adding"
        });
    }
}
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        
          
            await Listing.findByIdAndUpdate(id, req.body.listing);
            req.flash("success","Listing updated");
        res.redirect(`/listings/${id}`);
        
            
        
    } catch (error) {
        res.status(500).json({
            msg: "Problem in editing"
        });
    }
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    try {
        await Listing.deleteOne(listing);
    }
    catch (err) {
        res.status(400).json({
            msg: "Cannot Delete"
        })
    }

    res.redirect("/listings")

}