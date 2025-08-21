const mongoose = require("mongoose");

// Time Entry Schema
const TimeEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    activityType: {
        type: String,
        enum: ["research", "drafting", "court", "meeting", "other"],
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    hours: {
        type: Number,
        required: true,
        min: 0,
    },
    isBillable: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ["automatic", "manual"],
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("TimeEntry", TimeEntrySchema);