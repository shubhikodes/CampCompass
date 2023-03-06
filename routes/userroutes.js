const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport=require('passport');
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerForm)
    .post(users.registerUser)


router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local' ,{failureFlash:true, failureRedirect:'/login', keepSessionInfo:true}), users.loginUser)

router.get('/logout', users.logoutUser)

module.exports=router;
