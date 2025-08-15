// backend/routes/chat.js
const express = require("express");
const axios = require("axios"); // For making HTTP requests
const verifyToken = require("@middleware/auth.middleware"); // Assuming you have a middleware for token verification
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {


    const { query } = req.body;

    if (!query || !query.trim()) {
        return res.status(400).json({ error: "Message cannot be empty" });
    }

    try {
        console.log(" User message received at backend:", query);

        const chatbotResponse = await axios.post("http://localhost:8000/chat", {
            query,
        });

        const botResponse =
            chatbotResponse.data.response ||
            chatbotResponse.data.message ||
            JSON.stringify(chatbotResponse.data);

        console.log("Bot response from backend:", botResponse);

        res.json({ response: botResponse });
    } catch (error) {
        console.error("Error in /chat route:", error.message);
        res.status(500).json({ error: "Failed to get response from chatbot" });
    }
});

module.exports = router;
