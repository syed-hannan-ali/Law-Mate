const express = require("express");
const authRoutes = require("./auth.route.js");
const protectedRoutes = require("./protected.route.js");
const appointmentRoutes = require("./appointment.route.js");
const caseRoutes = require("./case.route.js");
const documentRoutes = require("./document.route");
const taskRoutes = require("./task.route");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/cases", caseRoutes);
router.use("/documents", documentRoutes);
// router.use("/tasks", taskRoutes);

module.exports = router;
