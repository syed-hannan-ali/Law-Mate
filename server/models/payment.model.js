const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        method: {
            type: String,
            enum: ["cash", "credit", "bank-transfer", "online"],
        },
        reference: {
            type: String, // transaction ID, check number, etc.
        },
        paidAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Payment", PaymentSchema);
