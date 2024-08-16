if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}
 

const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path'); 
const methodOverride=require('method-override');
const ejsMate= require('ejs-mate'); 
const session = require("express-session");
const flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require("connect-mongo");
 
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js')
const {listingSchema,reviewSchema}=require('./schema.js');
const Review=require('./models/review.js')
const Listing = require("./models/listing.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js");
 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL 

app.set('view engine' , 'ejs');
app.set("views", path.join(__dirname , "views"));
//for using ejs mate which is used to make boierplates that can be used commonly for many templates having similar code
app.engine('ejs', ejsMate); 

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); 

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, //1 day
});
store.on("error",()=>{
    console.log("Error in mongo session store"); 
})
const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};


main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err); 
}) 

async function main(){
    await mongoose.connect(dbURL);
}

app.get('/',(req,res)=>{
    res.redirect("/listings");
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"memail@gmail.com",
//         username:"musername",
//         });
//     const registeredUser = await User.register(fakeUser , "helloworl");
//     res.send(registeredUser);
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
 

// function asyncWrap(fn)
// {
//     return function(req,res,next){
//         fn(req,res,next).catch((err)=>{next(err)})
//     }
// }

// app.get('/listings/:id', asyncWrap(async(req,res,next)=>{   
//         let id=req.params.id;
//     const listing = await Listing.findById(id);
//     if(!listing)
//     {
//         return next(new expressError(500,"Listings not found"));
//     }
//     res.render("./listings/show.ejs" , {listing});    
// }));
   

// app.get('/testListing',async(req,res)=>{
//     let samplelisting = new Listing({
//         title:"farm house",
//         description:"This has a sceneric farm",
//         price:90000, 
//         location:"waynad, karnataka",
//         country:"India"
//     })
//     await samplelisting.save();
//     console.log("saved in database");
//     res.send('This is saved');
// })


// app.use((err,req,res,next)=>{
//     // res.send(err);
//     let {status=500, message="This is custom error"}= err;
//     res.send(message);
//  });

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="async function error"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
    //res.status(statusCode).send(message);
})
app.use((err,req,res,next)=>{
    res.send('some error occurred');
});
app.listen(8080,()=>{ 
    console.log("listening to port 8080");
});