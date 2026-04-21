const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
// const User = require('../models/user.js');
const passport = require('passport');
const {isRedirect} = require('../middleware.js');
const userController = require('../controllers/users.js');


//signup route
router.get('/signup', (userController.renderSignupForm));

router.post('/signup', wrapAsync(userController.singUp));

//login route
router.get('/login',(userController.renderLoginForm));

router.post('/login',isRedirect, passport.authenticate('local',{failureRedirect: '/login', failureFlash: true}), (userController.Login));

//logout route
router.get('/logout', (userController.Logout));

module.exports = router;