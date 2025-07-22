require("dotenv").config();

const connectDB = () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log(mongoURI);
        if (!mongoURI) throw new Error("MONGO_URI is missing in .env");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(" MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = { connectDB };
