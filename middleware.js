const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const asyncWrap = require("./utils/asyncWrap.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const customError = require("./utils/customError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login to continue");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

module.exports.isOwner = asyncWrap(async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        console.log(error);
        throw new customError(400,error);
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        console.log(error);
        throw new customError(400, error);
    }
    next();
}

module.exports.isAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}