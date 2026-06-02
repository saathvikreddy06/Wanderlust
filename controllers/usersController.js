const User = require("../models/user.js");

module.exports.renderRegisterForm = (req,res) => {
    res.render("../views/users/signup.ejs");
}

module.exports.signup = async (req,res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = await new User({
            username: username,
            email: email
        });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Registration succesfull!");
            res.redirect("/listings");
        });
    }
    catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("../views/users/login.ejs");
}

module.exports.login = (req,res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logout successfull!");
        res.redirect("/listings");
    });
}