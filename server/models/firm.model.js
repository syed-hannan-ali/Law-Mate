const mongoose = require("mongoose");
const { Schema } = mongoose;

const firmSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    subscription: {
        plan: {
            type: Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
        },
        startDate: Date,
        endDate: Date,
        isActive: { type: Boolean, default: false },
    },

    phone: {
        type: String,
    },
    staff: [
        {
            type: Schema.Types.ObjectId,
            ref: "User", // or 'Lawyer' if you have a separate model
        },
    ],
    cases: [
        {
            type: Schema.Types.ObjectId,
            ref: "Case",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Firm", firmSchema);
