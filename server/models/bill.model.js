const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeEntriesRate: [
        {
            timeEntry: {    
                type: mongoose.Schema.Types.ObjectId,
                ref: "TimeEntry",
                required: true,
            },
            hourlyRate: {
                type: Number,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["draft", "sent", "paid", "overdue"],
        default: "draft",
    },
    notes: String,
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", BillSchema);
