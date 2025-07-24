const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        case: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Case",
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        date: {
            type: Date,
            required: true,
        },

        durationMinutes: {
            type: Number,
            default: 30,
        },

        location: {
            type: String, // e.g., physical address or court room
        },

        meetingLink: {
            type: String, // For virtual appointments (Zoom/Google Meet/etc.)
        },

        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled", "rescheduled"],
            default: "scheduled",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
