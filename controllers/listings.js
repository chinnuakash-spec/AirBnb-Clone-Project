const mbxGeoCoordinates = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoordinates({ accessToken: mapBoxToken });
const List = require('../models/listing.js');
const { response } = require('express');

module.exports.index = async (req,res) =>{
    let allistings = await List.find({});
    res.render("lists/index.ejs", {allistings});
};

module.exports.renderNewForm =(req,res) =>{
    res.render("lists/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await List.findById(id)
    .populate({path:'reviews', populate:{path: "author"}})
    .populate('owner');
    res.render("lists/show.ejs", {listing});
};

module.exports.createListing = async(req,res,next) =>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
})
  .send();


    let url = req.file.path;
    let filename = req.file.filename;
    let category = req.body.listing.category;
    const newList = new List(req.body.listing);
    newList.image = {url, filename},
    newList.owner = req.user._id;
    newList.geometry = response.body.features[0].geometry;
    newList.category = category;
    await newList.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect(`/lists`);
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await List.findById(id);
    if(!listing){
        req.flash('error', 'Listing not found!');
        return res.redirect('/lists');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_300');
    res.render("lists/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let updList = await List.findByIdAndUpdate(id, req.body.listing);

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updList.image = { url, filename };
        await updList.save();
    }
    req.flash('success', 'Listing updated successfully!');
     if(!updList){
        req.flash('error', 'Listing not found!');
        return res.redirect('/lists');
    }
    res.redirect(`/lists/${id}`);
};

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    await List.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/lists'); 
};

module.exports.filterByCategory = async(req,res) =>{
    let category = req.query.category;
    let allistings = await List.find({category: category});
        if(allistings.length === 0){
            req.flash('error', `No listings found for category: ${category}`);
            return res.redirect('/lists');
        };
    res.render("lists/index.ejs", {allistings});
};