const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB error:", err);
        process.exit(1);
    }
};

module.exports = { connectDB };
