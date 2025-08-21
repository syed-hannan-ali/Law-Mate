const express = require("express");
const router = express.Router();
const verifyToken = require("@middleware/auth.middleware");
const Messages = require("@models/message.model");

router.get("/:caseId", verifyToken, async (req, res) => {
    const { caseId } = req.params;
    // Fetch messages for the specific case ID
    // You would typically query your database here
    try {
        const messages = await Messages.find({ caseId })
            .sort({ createdAt: 1 })
            .populate("sender", "username role");
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
