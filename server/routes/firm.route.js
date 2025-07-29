const express = require('express');
const router = express.Router();

// Controller functions
const {
    createFirm,
    getAllFirms,
    getFirmById,
    updateFirm,
    deleteFirm,
} = require('@controllers/firm.controller');

const verifyToken = require("@middleware/auth.middleware");

// Routes
router.post('/', verifyToken, createFirm);          // Create a new firm
router.get('/', verifyToken, getAllFirms);          // Get all firms
router.get('/:id', verifyToken, getFirmById);       // Get a firm by ID
router.put('/:id', verifyToken, updateFirm);        // Update a firm
router.delete('/:id', verifyToken, deleteFirm);     // Soft delete a firm

module.exports = router;
