const express = require("express");
const router = express.Router();

// Controller functions
const {
    createFirm,
    getAllFirms,
    getFirmById,
    updateFirm,
    deleteFirm,
    getFirmStaffCount,
    getFirmStaff,
} = require("@controllers/firm.controller");

const verifyToken = require("@middleware/auth.middleware");

// Routes
router.post("/", verifyToken, createFirm); // Create a new firm
router.get("/", verifyToken, getAllFirms); // Get all firms
router.get("/staff", verifyToken , getFirmStaff)
router.get("/:id", verifyToken, getFirmById); // Get a firm by ID
router.put("/:id", verifyToken, updateFirm); // Update a firm
router.delete("/:id", verifyToken, deleteFirm); // Soft delete a firm
router.get("/:firmId/staff-count", verifyToken ,getFirmStaffCount);

module.exports = router;
