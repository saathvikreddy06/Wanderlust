const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/usersController.js");


router.route("/signup")
.get(usersController.renderRegisterForm)
.post(usersController.signup);

router.route("/login")
.get(usersController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", 
    {
    failureRedirect: "/login",
    failureFlash: true
    }), 
    usersController.login
);

router.get("/logout", usersController.logout);

module.exports = router;