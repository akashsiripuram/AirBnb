const express = require('express');
const router= express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const { listingSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require("../models/listing.js");
const {isLoggedIn}=require('../middleware');

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//New & Create Route
router.get("/new",isLoggedIn,(req,res)=>{
    
    
    res.render("./listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error","listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}))

//create route
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","new listing created");
        res.redirect("/listings");
    
    })
);

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash("error","listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id",isLoggedIn,wrapAsync(async  (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
        res.redirect("/listings");

}));


module.exports=router;