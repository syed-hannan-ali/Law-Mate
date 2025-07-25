const express = require("express");
const router = express.Router();
const User = require("@models/user.model.js");
const verifyToken = require("@middleware/auth.middleware");
const authorizeRoles = require("@middleware/rbac.middleware");

router.get("/", verifyToken, async (req, res) => {
    // Simulating a protected route
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    console.log("User authenticated: ", req.user);
    res.send(`Hello ${req.user.username} you are authenticated!`);
});

router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

router.get(
  "/case/:id",
  verifyToken,
  authorizeRoles("lawyer", "admin"),
  (req, res) => {
    res.json({ message: "Viewing case " });
  }
);

module.exports = router;
