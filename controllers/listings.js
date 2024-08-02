const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createNewListing = async(req,res,next)=>{ 
    const url = req.file.path;
    const filename = req.file.filename; 
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    await newListing.save();
    req.flash("success","New user created!");
    res.redirect('/listings');  
};

module.exports.showListing = async(req,res)=>{ 
    let id=req.params.id;
    const listing = await Listing.findById(id)
    .populate({path:"review",
        populate:{
            path:"author",
        } 
    })
    .populate("owner");
    if(!listing)
    {
        req.flash("error","The listing you are accessing is not present");
        res.redirect("/listings");
    } 
    res.render("./listings/show.ejs" , {listing});
};

module.exports.editListing = async(req,res)=>{
    let id=req.params.id;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","The listing you are accessing is not present");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs" , {listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let id=req.params.id;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !== "undefined")
    {
        let url=req.file.path;
        let filename = req.file.fielname;
        listing.image ={url,filename};
        listing.save();
    }
    req.flash("success","Edited successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted sucessfully !");
    res.redirect('/listings')
};