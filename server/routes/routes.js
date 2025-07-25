const express = require("express");
const authRoutes = require("./auth.route.js");
const protectedRoutes = require("./protected.route.js");
// const caseRoutes = require("./case.routes");
// const documentRoutes = require("./document.routes");
// const taskRoutes = require("./task.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
// router.use("/cases", caseRoutes);
// router.use("/documents", documentRoutes);
// router.use("/tasks", taskRoutes);

module.exports = router;
