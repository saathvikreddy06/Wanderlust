const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing, validateReview} = require("../middleware.js");
const listingsController = require("../controllers/listingsController.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(asyncWrap(listingsController.index))
.post(isLoggedIn, validateListing, upload.single("listing[image]"), asyncWrap(listingsController.createListing));

router.get("/new", isLoggedIn, listingsController.renderNewForm);

router.get("/category/:category", listingsController.categoryListings);

router.route("/:id")
.get(asyncWrap(listingsController.showListing))
.patch(isLoggedIn, isOwner, upload.single("listing[image]"), asyncWrap(listingsController.updateListing))
.delete(isLoggedIn, isOwner, asyncWrap(listingsController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(listingsController.renderEditForm));

module.exports = router;