const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        status: {
            type: String,
            enum: ["open", "in-progress", "closed", "archived"],
            default: "open",
        },

        tags: {
            type: [String],
            default: [],
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedStaff: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        documents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],

        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],


        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updatedBy: {
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


module.exports = mongoose.model("Case", CaseSchema);
