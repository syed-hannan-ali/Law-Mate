require("module-alias/register");
require("dotenv").config();
require("@config/auth.config.js");

const express = require("express");
const cors = require("cors");

const { connectDB } = require("@config/db.config.js");
const User = require("@models/user.model.js");

const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173", // Change to your frontend URL
        credentials: true, // Allow cookies to be sent
    }),
);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultsecret",
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", require("@routes/routes.js"));

connectDB();

// Test route
app.get("/", (req, res) => res.send("Welcome to Law Mate Backend"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

function isAuthenticated(req, res, next) {
    req.user ? next() : res.status(401).send("Unauthorized");
}

app.get("/failure", (req, res) => {
    res.send("Authentication failed. Please try again.");
});

app.get("/protected", isAuthenticated, (req, res) => {
    // Simulating a protected route
    res.send(`Hello ${req.user.displayName} you are authenticated!`);
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Logout failed.");
        }
        req.session.destroy();
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});
