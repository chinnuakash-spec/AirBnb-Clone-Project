if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = process.env.ATLASDB_URL;
const path = require('path');
const port = 8080;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
//const middleware = require('./middleware.js');

const listingsRouter = require('./router/listing.js');
const reviewsRouter = require('./router/review.js');
const userRouter = require('./router/user.js');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
});

store.on("error", (err) =>{
    console.log("Session Store Error", err);
});

const SessionOptions =({
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 *24 * 7,
        httpOnly: true
    }

});

main().then(() =>{
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());

app.use(session(SessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});



app.use('/lists', listingsRouter);
app.use('/lists/:id/reviews', reviewsRouter);
app.use('/', userRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) =>{
    let { statusCode= 500, message ="Something went Wrong!"} = err;
    res.status(statusCode).render("lists/error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server is listening to port 8080`);
});