// backend/routes/chat.js
const express = require("express");
const axios = require("axios"); 
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const verifyToken = require("@middleware/auth.middleware");

const router = express.Router();

// configure multer for file uploads (temp storage)
const upload = multer({ dest: "uploads/" });

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
    const { query, mode , history } = req.body;

    try {
        console.log("User request received:", { query, mode  , history});

        let chatbotResponse;

        if (mode === "qa") {
            if (!query || !query.trim()) {
                return res.status(400).json({ error: "Message cannot be empty" });
            }

            chatbotResponse = await axios.post("http://localhost:8000/chat", {
                query,
                history
            });
        } 
        else if (mode === "summarize") {
            if (!req.file) {
                return res.status(400).json({ error: "File is required for summarization" });
            }

            // Prepare form-data for FastAPI
            const formData = new FormData();
            formData.append("file", fs.createReadStream(req.file.path));

            console.log("File uploaded:", req.file.path);

            chatbotResponse = await axios.post(
                "http://localhost:8000/documents/summarize",
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                }
            );

            console.log("File summarized:", chatbotResponse.data.summary);

            // clean up temp file
            fs.unlinkSync(req.file.path);
        } 
        else {
            return res.status(400).json({ error: "Invalid mode" });
        }

        const botResponse =
            chatbotResponse.data.response ||
            chatbotResponse.data.summary || // in case summarizer returns { summary }
            chatbotResponse.data.message ||
            JSON.stringify(chatbotResponse.data);

        console.log("Bot response:", botResponse);

        res.json({ response: botResponse });
    } catch (error) {
        console.error("Error in /chat route:", error.message);

        // pass back FastAPI error if available
        if (error.response) {
            return res
                .status(error.response.status || 500)
                .json(error.response.data);
        }

        res.status(500).json({ error: "Failed to get response from chatbot" });
    }
});

module.exports = router;
