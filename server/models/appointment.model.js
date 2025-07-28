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
            default: "",
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
            empty: true,
        },

        durationMinutes: {
            type: Number,
            default: 0,
        },

        location: {
            type: String, // e.g., physical address or court room
            empty: true,
        },

        meetingLink: {
            type: String, // For virtual appointments (Zoom/Google Meet/etc.)
            empty: true,
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
