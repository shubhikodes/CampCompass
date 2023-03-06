const express=require('express');
const router=express.Router({mergeParams : true});
const Review=require('../models/reviews');
const Campground=require('../models/Campground');
const catchAsync=require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const {reviewSchema}=require('../schemas.js')
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/',validateReview, isLoggedIn,catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports=router;
