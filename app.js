if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const campground_file = require('./routes/campground');
const review_file = require('./routes/review');
const user_file = require('./routes/userroutes');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore = require("connect-mongo");
const mongo = require('./mongo.js')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // useFindAndModify: false,
// })
//     .then(() => {
//         console.log("DATABASE CONNECTED!!");
//     })
//     .catch(err => {
//         console.log("OH NO MONGO ERROR!!");
//         console.log(err);
//     })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: 'thisshouldbeabettersecret',
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUnitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'nayakanshita27@gmail.com', username: 'anshita' });
    const newUser = await User.register(user, 'nayak');
    res.send(newUser);
})


app.use('/campgrounds', campground_file);
app.use('/campgrounds/:id/reviews', review_file);
app.use('/', user_file);

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!!'
    res.status(statusCode).render('error.ejs', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})

mongo();