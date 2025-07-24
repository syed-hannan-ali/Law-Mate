require("module-alias/register");
require("dotenv").config();
require("@middleware/auth.js");

const User = require("@models/user.js");

const express = require("express");

const { connectDB } = require("@config/db.js");
const passport = require("passport");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


function isAuthenticated(req, res, next) {
    req.user ? next() : res.status(401).send("Unauthorized");
}

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>');
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/failure",
        successRedirect: "/protected",
    }),
);

app.get("/failure", (req, res) => {
    res.send("Authentication failed. Please try again.");
});

app.get("/protected", isAuthenticated ,(req, res) => {
    // Simulating a protected route
    res.send("This is a protected route");
});

app.listen(PORT, () => {
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
});
