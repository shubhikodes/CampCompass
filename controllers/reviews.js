const Campground=require('../models/Campground');
const Review=require('../models/reviews');

module.exports.createReview = async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    review.author=req.user._id;
    await campground.save();
    await review.save();
    req.flash('success','Created New Review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const{id,reviewId}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send('deleted!!!')
}