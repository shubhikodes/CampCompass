const express=require('express')
const app=express()
const catchAsync=require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground=require('../models/Campground')
const campgrounds = require('../controllers/campgrounds.js')
const {campgroundSchema}=require('../schemas.js')
const {isLoggedIn, validateCampground, isAuthor}=require('../middleware.js')
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage })
const router=express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground,catchAsync(campgrounds.makeNewCampground))
    

router.get('/new',isLoggedIn, campgrounds.makeNewCampgroundForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm))

module.exports=router;