const User = require("../models/user");

module.exports.renderSignupForm = (req, res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signupUser = async(req,res)=>{
    try{
        let {username ,email , password}=req.body;
        let newUser = new User({
            username,
            email
        });
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "welcome to WanderLust");
            res.redirect("/listings");
        })
    }
    catch(e)
    {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");

    });

};