const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createNewReview = async(req,res,next)=>{
  
    let id=req.params.id;
    let listing =await Listing.findById(id); 
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    listing.review.push(newReview);
    await listing.save();
    req.flash("success","Review added sucessfully !");
    res.redirect(`/listings/${id}`);    
};

module.exports.deleteReview = async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id ,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted sucessfully !");
    res.redirect(`/listings/${id}`);
};