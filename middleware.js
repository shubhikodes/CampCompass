const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema}=require('./schemas.js');
const Campground=require('./models/Campground');
const Review=require('./models/reviews');

module.exports.isLoggedIn = (req,res,next)=>{
    req.session.returnTo = req.originalUrl;
   
    if(!req.isAuthenticated()){  
        req.flash('error','Sign In Required!');  
        res.redirect('/login');
    }
    else{
        next();
    }
}

module.exports.validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body)
    
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params
    const campground = await Campground.findById(id);
    if(req.user && (!campground.author.equals(req.user._id))){
        req.flash('error',"Campground doesn't belong to you!");
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId);
    if(req.user && (!review.author.equals(req.user._id))){
        req.flash('error',"Review doesn't belong to you!");
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else {
        next();
    }
}
