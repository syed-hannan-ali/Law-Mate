const express = require("express");
const router = express.Router();
const userController = require("@controllers/user.controller");
const verifyToken = require("@middleware/auth.middleware.js");
const authorizeRole = require("@middleware/rbac.middleware.js");

console.log(userController.getAllUsers);

router.get("/", userController.getAllUsers);
router.get(
    "/getProfile",
    verifyToken,
    userController.getUserProfile, // Assuming this method fetches the current user's profile
);
router.get("/:id", verifyToken, userController.getUserById);
router.put(
    "/:id",
    verifyToken,
    userController.updateUser,
);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
