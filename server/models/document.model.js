const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        fileKey: {
            type: String,
            required: true, // S3 key for deletion / retrieval
        },
        fileUrl: {
            type: String,
            required: true, // Public URL for display/download
        },

        originalName: {
            type: String,
        },

        mimeType: {
            type: String, // e.g. "application/pdf", "image/png"
        },

        sizeInBytes: {
            type: Number,
        },

        storage: {
            type: String,
            enum: ["local", "s3", "gcs", "azure"],
            default: "s3",
        },

        case: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Case",
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        version: {
            type: Number,
            default: 1,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    },
);

module.exports = mongoose.model("Document", DocumentSchema);
