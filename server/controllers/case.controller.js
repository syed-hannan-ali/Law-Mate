const Case = require("@models/case.model");
const Document = require("@models/document.model.js");


exports.createCase = async (req, res) => {
    console.log("Creating case with data:", req.body);

    console.log("User ID from request:", req.userId);

    try {
        const userId = req.userId;
        const clientId = req.body.client;
        const tittle = req.body.title;
        const description = req.body.description;

        const newCase = new Case({
            title: tittle,
            description: description,
            client: clientId,
            createdBy: userId,
            updatedBy: userId,
        });

        console.log("New case object:", newCase);

        await newCase.save();
        console.log("Case created successfully");

        // const saved = await newCase.save();
        res.status(201).json({
            message: "Case created successfully",
            case: newCase,
        });
    } catch (err) {
        console.error("Error creating case:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllCases = async (req, res) => {
    try {
        const cases = await Case.find({ isDeleted: false })
            .populate("client assignedStaff createdBy updatedBy")
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCaseById = async (req, res) => {

    console.log("Fetching case with ID:", req.params.id);
    try {
        const found = await Case.findById(req.params.id);
        if (!found || found.isDeleted)
            return res.status(404).json({ error: "Case not found" });
        res.json(found);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCase = async (req, res) => {
    try {
        const updated = await Case.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { ...req.body, updatedBy: req.user._id },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Case not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCase = async (req, res) => {
    try {
        const deleted = await Case.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true },
        );
        if (!deleted) return res.status(404).json({ error: "Case not found" });
        res.json({ message: "Case soft-deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
