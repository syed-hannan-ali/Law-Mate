const express = require("express");
const passport = require("passport");
const {
    loginUser,
    googleCallback,
    signupUser,
    updateToken,
} = require("@controllers/auth.controller");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/refresh-token", updateToken);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar",
        ],
        accessType: "offline",
        prompt: "consent",
    }),
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
    }),
    googleCallback,
);

module.exports = router;
