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

        // Signed document info
        signedFileKey: {
            type: String, // S3 key for signed version
        },
        signedFileUrl: {
            type: String, // Public URL for signed version
        },
        signedAt: {
            type: Date, // When it was signed
        },
        signedBy: [
            {
                name: String,
                email: String,
                signedAt: Date,
            }
        ],

        // E-signature provider tracking
        esignProvider: {
            type: String,
            enum: ["dropboxsign", "docusign", null],
            default: null,
        },
        esignRequestId: {
            type: String, // ID from e-sign API
        },
        esignStatus: {
            type: String,
            enum: ["pending", "signed", "declined", "expired", "not required"],
            default: "not required",
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
