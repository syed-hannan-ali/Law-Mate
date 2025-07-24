const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
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
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        items: [
            {
                description: String,
                quantity: Number,
                unitPrice: Number,
                total: Number,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["unpaid", "partial", "paid", "overdue"],
            default: "unpaid",
        },
        issuedDate: Date,
        dueDate: Date,
        paidAt: Date,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
