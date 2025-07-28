const express = require("express");
const router = express.Router();

const caseController = require("@controllers/case.controller");
const verifyToken = require("@middleware/auth.middleware");

router.post("/", verifyToken, caseController.createCase);
router.get("/", verifyToken, caseController.getAllCases);
router.get("/:id", verifyToken, caseController.getCaseById);
router.put("/:id", verifyToken, caseController.updateCase);
router.delete("/:id", verifyToken, caseController.deleteCase);

module.exports = router;
