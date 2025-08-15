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

        participants: [
            {
                name: String,
                email: String,
            },
        ],

        date: {
            type: Date,
            required: true,
        },

        duration: {
            type: Number,
            default: 0,
        },

        meetingUrl: {
            type: String,
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
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
