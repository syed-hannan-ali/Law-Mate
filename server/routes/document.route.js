const express = require("express");
const router = express.Router();

const documentController = require("@controllers/document.controller");
const verifyToken = require("@middleware/auth.middleware");
const upload = require("@config/multer.config");

const debugMiddleware = (req, res, next) => {
    console.log("=== REQUEST DEBUG INFO ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    console.log("File:", req.file);
    console.log("=== END DEBUG INFO ===");
    next();
};

router.post(
    "/",
    verifyToken,
    debugMiddleware, // Add debug middleware to log request details
    upload.single("file"),
    documentController.createDocument,
);
router.get("/", verifyToken, documentController.getAllDocuments);
router.get("/:id", verifyToken, documentController.getDocumentById);
router.put("/:id", verifyToken, documentController.updateDocument);
router.delete("/:id", verifyToken, documentController.deleteDocument);

module.exports = router;
