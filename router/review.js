const express = require('express');
const router = express.Router({mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
// const Review = require('../models/reviews.js');
// const List = require('../models/listing.js');
const reviewController = require("../controllers/reviews.js");
const {validateReview, isLoggedIn, isAuthor} = require('../middleware.js');

//review post route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//reviews delete route
router.delete("/:reviewId", isLoggedIn, isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;