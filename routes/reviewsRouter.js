const express = require("express");
const router = express.Router({mergeParams:true});
const asyncWrap = require("../utils/asyncWrap.js");
const {isLoggedIn, validateReview, isAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewsController = require("../controllers/reviewsController.js");

//Create review route
router.post("/", isLoggedIn, validateReview, asyncWrap(reviewsController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, asyncWrap(reviewsController.destroyReview));

module.exports = router;