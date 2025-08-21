const express = require("express");
const router = express.Router();
const verifyToken = require("@middleware/auth.middleware.js");
const TimeEntry = require("@models/timeEntry.model.js");

router.post("/", verifyToken, async (req, res) => {
    try {
        const newEntry = new TimeEntry({
            user: req.userId,
            case: req.body.case,
            task: req.body.task,
            activityType: req.body.activityType,
            description: req.body.description,
            hours: req.body.hours,
            isBillable: req.body.isBillable,
            date: req.body.date,
            type: req.body.type,
        });
        await newEntry.save();

        const obj = await TimeEntry.findById(newEntry._id)
            .populate("case", "title")
            .populate("task", "title");
        res.status(201).json(obj);
    } catch (error) {
        console.error("Error creating time entry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const timeEntries = await TimeEntry.find({ user: req.userId })
            .populate("case", "title") // only bring "title" field from Case
            .populate("task", "title"); // only bring "title" field from Task
        res.status(200).json(timeEntries);
    } catch (error) {
        console.error("Error fetching time entries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
