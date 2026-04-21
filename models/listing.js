const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image:{
       url: String,
       filename: String,
    },
    price: Number,
    location: String,
    country: String,

    reviews:
    [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },

    category: {
        type: String,
        enum: ['Trending','Rooms', 'Iconic-Cities','Mountains', 'Castles','Pools', 'Camping', 'Farms', 'Arctic', 'Restaurants'],
        required: true,
    },
});

listSchema.post("findOneAndDelete", async(lists) =>{
    if(lists){
        await Review.deleteMany({_id: {$in: lists.reviews}});
    }
});

const List = mongoose.model('List', listSchema);

module.exports = List;