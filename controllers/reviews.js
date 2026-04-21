const Review = require('../models/reviews.js');
const List = require('../models/listing.js');

module.exports.createReview = async(req,res) =>{
    let listing = await List.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/lists/${listing._id}`);
};

module.exports.destroyReview =async(req,res) =>{
    let {id, reviewId} = req.params;
    await List.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/lists/${id}`);
};