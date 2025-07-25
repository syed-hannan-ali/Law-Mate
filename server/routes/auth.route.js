const express = require("express");
const passport = require("passport");
const {
    loginUser,
    googleCallback,
    signupUser,
} = require("@controllers/auth.controller");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
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
