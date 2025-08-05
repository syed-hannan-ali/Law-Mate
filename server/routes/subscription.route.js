const express = require("express");
const router = express.Router();
const subscriptionController = require("@controllers/subscription.controller");
const verifyToken = require("@middleware/auth.middleware");

router.post(
    "/create-plan",
    verifyToken,
    subscriptionController.createSubscriptionPlan,
);
router.post(
    "/assign-to-firm",
    verifyToken,
    subscriptionController.assignSubscriptionToFirm,
);

module.exports = router;
