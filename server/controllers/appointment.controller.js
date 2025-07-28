const Appointment = require("@models/appointment.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");

console.log(logAudit);

exports.createAppointment = async (req, res) => {
    console.log("Creating appointment with data:", req.body);

    console.log("User ID from request:", req.userId);

    try {
        const appointment = new Appointment({
            ...req.body,
            createdBy: req.userId,
        });
        const saved = await appointment.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    console.log("Fetching all appointments");
    try {
        const appointments = await Appointment.find({ isDeleted: false })
            .populate("case participants createdBy", "name email")
            .sort({ date: 1 }); // upcoming first
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate(
            "case participants createdBy",
            "name email",
        );
        if (!appointment || appointment.isDeleted)
            return res.status(404).json({ error: "Appointment not found" });

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const updated = await Appointment.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true },
        );

        if (!updated) return res.status(404).json({ error: "Not found" });

        // console.log(req);
        const user = await User.findById(req.userId);

        await logAudit({
            user: user,
            action: "UPDATE_CASE",
            target: "Case",
            description: `Case ${req.params.id} was updated`,
            metadata: { updatedFields: req.body },
        });

        console.log("Logged");

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true },
        );
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
