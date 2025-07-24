const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = {
        name: "Talha Bakhat ",
        email: "bcsf22m501@pucit.edu.pk",
        password: "123",
    }; // Simulated user for demonstration
    const users = [user]; // Simulated user database

    const userExists = users.find(
        (u) => u.email === email && u.password === password,
    );

    if (userExists) {
        res.status(200).json({ message: "Login successful", user });
    } else {
        res.status(401).json({ error: "Invalid email or password" });
    }
});


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
    (req, res) => {
        const user = {
            name: req.user.displayName,
            email: req.user.emails[0].value,
        };
         res.redirect(`http://localhost:5173/oauth-success?user=${encodeURIComponent(JSON.stringify(user))}`);
    },
);

module.exports = router;
