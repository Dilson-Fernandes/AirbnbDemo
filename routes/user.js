const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport")
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signupUser));

router.route("/login") 
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",
    {
    failureRedirect:"/login", 
    failureFlash:true,
    }),
    userController.loginUser
);

router.get("/logout",userController.logoutUser);

module.exports = router;