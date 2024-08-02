const express = require('express');
const router = express.Router();
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage: storage });


const wrapAsync=require('../utils/wrapAsync.js');
const {validateListing} = require("../middleware.js");

const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController =require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createNewListing));



//create route
router.get('/new',isLoggedIn,listingController.renderNewForm);

router.get('/search',async(req,res)=>{
    const { category } = req.query; // Extract the category from the query parameters
    let query = {};

    if (category) {
      // Case-insensitive search on the category field
      query.category = { $regex: category, $options: 'i' };
    }
    let allListings =await Listing.find({category:query.category});
    res.render('./listings/searched.ejs', { allListings });
})

router.route("/:id")
.get(wrapAsync(listingController.showListing) )
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit ROUTE 
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports = router;