require("module-alias/register");
require("dotenv").config();

const express = require("express");

const { connectDB } = require("@config/db.js");

connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
    res.send("🚀 Server is running");
});

app.listen(PORT, () => {
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
});
