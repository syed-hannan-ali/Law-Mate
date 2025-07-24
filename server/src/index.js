require("module-alias/register");
require("dotenv").config();
require("@middleware/auth.js");

const express = require("express");

const { connectDB } = require("@config/db.js");
const User = require("@models/user.js");

const session = require("express-session");
const passport = require("passport");

const app = express();

app.use(express.json());
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
});

connectDB();

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
