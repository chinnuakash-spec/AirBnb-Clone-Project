const mongoose = require('mongoose');
const initData = require('./data.js');
const List = require('../models/listing.js');

const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';
main()
    .then(() =>{
        console.log("Connected to MongoDB");
    }).catch(err => {
        console.log("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const initDB = async() =>{
   await List.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: '69aa868193f4128036173490'}));
   await List.insertMany(initData.data);
    console.log("Database intialized with data");
};

initDB();