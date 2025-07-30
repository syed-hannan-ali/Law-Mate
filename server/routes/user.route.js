const express = require("express");
const router = express.Router();
const userController = require("@controllers/user.controller");
const verifyToken = require("@middleware/auth.middleware.js");
const authorizeRole = require("@middleware/rbac.middleware.js");

console.log(userController.getAllUsers);

router.get("/", verifyToken, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put(
    "/:id",
    verifyToken,
    authorizeRole("admin"),
    userController.updateUser,
);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
