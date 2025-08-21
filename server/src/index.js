require("module-alias/register");
require("dotenv").config();
require("@config/auth.config.js");
require("@services/cron");

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { initSocket } = require("../socket/socket.js");

const { connectDB } = require("@config/db.config.js");

const session = require("express-session");
const passport = require("passport");
const rateLimit = require("@middleware/rateLimit.middleware.js");

const app = express();
const httpServer = createServer(app);

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 3);
app.use(
    cors({
        origin: "http://localhost:5173", // Change to your frontend URL
        credentials: true, // Allow cookies to be sent
    }),
);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultsecret",
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(passport.initialize());
app.use(passport.session());
const io = initSocket(httpServer, {
    corsOrigin: "http://localhost:5173", // Pass your frontend URL here
});

// app.use(mongoSanitize()); // Sanitize MongoDB operators
// app.use(xss()); // Sanitize input from malicious HTML & scripts

app.use((req, res, next) => {
    req.io = io;
    console.log("Socket.IO initialized and Attached to the Request");
    next();
});

app.use("/api", rateLimit, require("@routes/routes.js"));

connectDB();

// Test route
app.get("/", (req, res) => res.send("Welcome to Law Mate Backend"));

const PORT = process.env.PORT;

// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

httpServer.listen(PORT, () => {
    console.log(`Server + Socket.IO running on http://localhost:${PORT}`);
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Logout failed.");
        }
        req.session.destroy();
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});
