const Campground=require('../models/Campground');
const cloudinary = require('cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken});


module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.makeNewCampgroundForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.showCampground = async(req,res)=>{
    const{id}=req.params;
    const campground=await Campground.findById(id).populate({
        path:'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
   
    if(!campground){
        req.flash('error','Campground Not Found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}

module.exports.editCampgroundForm = async (req,res)=>{
    const{id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground){
        req.flash('error','Campground Not Found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground})

}

module.exports.makeNewCampground = async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    console.log(geoData.body.features[0].geometry);
   // res.send('doneeeeeeeeeeee');
    const campground=new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    await campground.save()
    req.flash('success','New Campground created successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.editCampground = async(req,res)=>{
        const{id}=req.params;
        const campground=await Campground.findByIdAndUpdate(id,{title:req.body.campground.title, location:req.body.campground.location},{runValidators:true})
        const geoData = await geocoder.forwardGeocode({
            query : req.body.campground.location,
            limit : 1
        }).send();
        campground.geometry = geoData.body.features[0].geometry;
        const imgs =  req.files.map(f=>({url:f.path, filename:f.filename}));
        campground.images.push(...imgs);
        if(req.body.deleteImages){
            for(let file of req.body.deleteImages){
                await cloudinary.uploader.destroy(file);
            }
            await campground.updateOne({ $pull : { images : { filename : { $in : req.body.deleteImages }}}});   
        }
        console.log(campground);
        await campground.save();
        req.flash('success','Campground updated successfully');
        res.redirect('/campgrounds');  
}

module.exports.deleteCampground = async(req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndDelete(id)
    req.flash('success','Campground Deleted successfully')
    res.redirect('/campgrounds')
}
