const express = require('express');
const router= express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require('../models/review.js');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const { reviewSchema}=require('../schema.js');

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//delete route




//reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","review created successfully")
    res.send("Saved the review")
}));

router.delete("/:reviewId",wrapAsync(async (req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;