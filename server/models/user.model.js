const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        hashedPassword: {
            type: String,
        },

        role: {
            type: String,
            enum: ["lawyer", "client", "admin", "paralegal"],
            default: "client", 
        },

        contactInfo: {
            phone: { type: String },
            address: { type: String },
        },

        permissions: {
            type: [String], // Optional custom permissions
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        lastLoginAt: {
            type: Date,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    },
);

UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
