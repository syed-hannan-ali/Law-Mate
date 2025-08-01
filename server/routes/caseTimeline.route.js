const express = require("express");
const router = express.Router();
const verifyToken = require("@middleware/auth.middleware");
const {
    createTimelineEntry,
    getTimelinesByCase,
    getSingleTimelineEntry,
    updateTimelineEntry,
    deleteTimelineEntry,
} = require("@controllers/caseTimeline.controller");

// 🔹 Create a timeline entry for a case
router.post("/", verifyToken, createTimelineEntry);

// 🔹 Get all timeline entries for a case
router.get("/case/:caseId", verifyToken, getTimelinesByCase);

// 🔹 Get a specific timeline entry
router.get("/:timelineId", verifyToken, getSingleTimelineEntry);

// 🔹 Update a timeline entry
router.put("/:timelineId", verifyToken, updateTimelineEntry);

// 🔹 Delete a timeline entry
router.delete("/:timelineId", verifyToken, deleteTimelineEntry);

module.exports = router;
