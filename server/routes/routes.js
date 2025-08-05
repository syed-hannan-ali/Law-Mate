const express = require("express");
const authRoutes = require("./auth.route.js");
const protectedRoutes = require("./protected.route.js");
const appointmentRoutes = require("./appointment.route.js");
const caseRoutes = require("./case.route.js");
const documentRoutes = require("./document.route");
const caseTimelineRoutes = require("./caseTimeline.route.js");
const taskRoutes = require("./task.route");
const firmRoutes = require("./firm.route.js");
const userRoutes = require("./user.route.js");
const subscriptionRoutes = require("./subscription.route.js");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/cases", caseRoutes);
router.use("/documents", documentRoutes);
router.use("/firms",firmRoutes);
router.use("/users", userRoutes);
router.use("/case-timelines", caseTimelineRoutes);
router.use("/tasks", taskRoutes);
router.use("/subscriptions", subscriptionRoutes);

module.exports = router;
