const express = require("express");
const router = express.Router();
const appointmentController = require("@controllers/appointment.controller.js");
const verifyToken = require("@middleware/auth.middleware.js"); // adjust as needed

router.post("/", verifyToken, appointmentController.createAppointment);
router.get("/", verifyToken, appointmentController.getAllAppointments);
router.get("/:id", verifyToken, appointmentController.getAppointmentById);
router.put("/:id", verifyToken, appointmentController.updateAppointment);
router.delete("/:id", verifyToken, appointmentController.deleteAppointment);

module.exports = router;
