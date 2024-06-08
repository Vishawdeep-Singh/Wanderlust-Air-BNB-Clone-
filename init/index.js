const mongoose = require("mongoose");
const Listing = require("../db/listing");
const initdata = require("./data.js");


async function main1(){
    await mongoose.connect(process.env.MONGOURL)
 }
 main1().then(()=>{
     console.log("connected to DB");
 
 }).catch( (err) =>{
     console.log(err);
 })

 const initDB = async()=>{
 await Listing.deleteMany({});
 initdata.data=initdata.data.map((obj)=>({...obj,owner:"6659683a43b11123f9dc2b5f"}))
 await Listing.insertMany(initdata.data);
 console.log("data was initialised")


 }; 
 initDB()
