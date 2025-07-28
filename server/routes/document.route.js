const express = require("express");
const router = express.Router();

const documentController = require("@controllers/document.controller");
const verifyToken = require("@middleware/auth.middleware");

router.post("/", verifyToken, documentController.createDocument);
router.get("/", verifyToken, documentController.getAllDocuments);
router.get("/:id", verifyToken, documentController.getDocumentById);
router.put("/:id", verifyToken, documentController.updateDocument);
router.delete("/:id", verifyToken, documentController.deleteDocument);

module.exports = router;
