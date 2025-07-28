// models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            role: String,
            email: String,
        },
        action: { type: String, required: true }, // e.g., "UPDATE_CASE"
        target: {
            type: String, // e.g., "Case", "Subscription"
            id: mongoose.Schema.Types.ObjectId,
        },
        description: String, // Human-readable message
        timestamp: { type: Date, default: Date.now },
        metadata: Object, // e.g., { oldValue, newValue }
    },
    { timestamps: true },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
