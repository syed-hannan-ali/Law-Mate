const jwt = require("jsonwebtoken");
require("dotenv").config();

const signingKey = process.env.JWT_SIGNING_KEY;

function verifyToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
        console.log("Token received: " + token);
        // Remove "Bearer " prefix if present
        const tokenWithoutBearer = token.startsWith("Bearer ");
        const cleanToken = tokenWithoutBearer ? token.slice(7) : token;
        console.log("Clean token: " + cleanToken);

        const decoded = jwt.verify(cleanToken, signingKey);
        console.log("Decoded token: ", decoded);

        console.log(req.userId);
        console.log(req.userRole);

        req.userId = decoded.userId;
        req.userRole = decoded.userRole;

        console.log("Decoded token: ", decoded);

        console.log(req.userId);
        console.log(req.userRole);

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;
