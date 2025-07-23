require("module-alias/register");
require("dotenv").config();

const User = require("@models/user.js");

const express = require("express");

const { connectDB } = require("@config/db.js");

connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", async (_req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (e) {
        console.error("Error fetching user:", e);
        res.send({ e });
    }
});

app.post("/api/test", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (e) {
        console.error("Error creating user:", e);
        res.send({ error: e });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Server listening on http://localhost:${PORT}`);
});
