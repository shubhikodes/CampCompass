const User=require('../models/User');

module.exports.registerForm = (req,res)=>{
    res.render('users/register');
}

module.exports.registerUser = async (req,res,next)=>{
    try{
        const{username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','Welcome to the Campground');
            res.redirect('/campgrounds');
        }) 
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
	req.logout(function (err) {
	req.flash('success', "Goodbye!");
	res.redirect('/campgrounds');
	});
}