if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const customError = require("./utils/customError.js");
const listingsRouter = require("./routes/listingsRouter.js");
const reviewsRouter = require("./routes/reviewsRouter.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/usersRouter.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

let dbUrl = process.env.ATLAS_DB_URL;
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60
});

store.on("error", (err) => {
    console.log("Error in MongoSession store", err);
})

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
    await mongoose.connect(dbUrl);
};

main().then(() => {
    console.log("Connected with DB:)");
}).catch(err => {
    console.log(err);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log("Server is running at port 8080");
});

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req,res) => {
    res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req,res,next) => {
    next(new customError(404, "Page not found"));
});

app.use((err,req,res,next) => {
    let {status = 500,message = "Something went wrong"} = err;
    res.status(status).render("listings/error.ejs", {message});
});

