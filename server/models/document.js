const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        fileUrl: {
            type: String,
            required: true, // Full path or cloud storage URL
        },

        originalName: {
            type: String,
        },

        mimeType: {
            type: String, // e.g. "application/pdf", "image/png"
        },

        fileType: {
            type: String,
            enum: ["pdf", "image", "text", "word", "other"],
            default: "other",
        },

        sizeInBytes: {
            type: Number,
        },

        storage: {
            type: String,
            enum: ["local", "s3", "gcs", "azure"],
            default: "local",
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

        aiSummary: {
            type: String,
        },

        extractedEntities: {
            type: [String], // For named entities or key info via NLP
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

// Index for search
DocumentSchema.index({ title: "text", tags: 1, aiSummary: "text" });

module.exports = mongoose.model("Document", DocumentSchema);
