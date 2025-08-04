const Case = require("@models/case.model");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");

exports.createCase = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req.body.client;
        const tittle = req.body.title;
        const description = req.body.description;
        const staff = req.body.assignedStaff || [];
        const status = req.body.status || "open";

        const newCase = new Case({
            title: tittle,
            description: description,
            client: clientId,
            assignedStaff: staff,
            status: status,
            createdBy: userId,
            updatedBy: userId,
        });

        console.log("New case object:", newCase);

        await newCase.save();

        await logAudit({
            user: await User.findById(userId),
            action: "CREATE_CASE",
            target: "Case",
            description: `Case ${newCase._id} was created`,
            metadata: {
                caseId: newCase._id,
                client: clientId,
                tittle,
                description,
            },
        });

        console.log("Case created successfully");

        // const saved = await newCase.save();
        res.status(201).json({
            case: newCase,
        });
    } catch (err) {
        console.error("Error creating case:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllCases = async (req, res) => {
    const requestingUserId = req.userId;
    const requestingUser = await User.findById(requestingUserId);

    let query = { isDeleted: false };
    try {
        console.log("Fetching all cases");
        if (
            requestingUser.role === "lawyer" ||
            requestingUser.role === "paralegal"
        ) {
            query.assignedStaff = requestingUserId;
        } else if (requestingUser.role === "client") {
            query.client = requestingUserId;
        }
        const cases = await Case.find(query)
            .populate("client assignedStaff createdBy updatedBy")
            .sort({ createdAt: -1 });

        console.log("Cases fetched successfully:", cases.length);

        res.status(200).json(cases);
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

        await found.populate("client assignedStaff createdBy updatedBy");
        res.json(found);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        console.log(
            "This is the req body ----------------------------------------------",
        );
        console.log(req.body);
        const updates = { ...req.body, updatedBy: req.userId };

        console.log("Updating case with ID:", caseId, "with data:", updates);

        const updated = await Case.findOneAndUpdate({ _id: caseId }, updates, {
            new: true,
        });

        if (!updated) return res.status(404).json({ error: "Case not found" });

        const user = await User.findById(req.userId);

        // Log audit
        await logAudit({
            user: user,
            action: "UPDATE_CASE",
            target: "Case",
            description: `Case ${updated._id} was updated`,
            metadata: {
                updatedFields: req.body,
                caseId: updated._id,
            },
        });

        res.json(updated);
    } catch (err) {
        console.error("Error updating case:", err);
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
        const user = await User.findById(req.userId);

        // Log the audit
        await logAudit({
            user: user,
            action: "DELETE_CASE",
            target: "Case",
            description: `Case ${deleted._id} was soft-deleted`,
            metadata: {
                caseId: deleted._id,
                deletedAt: new Date(),
            },
        });
        res.json({ message: "Case soft-deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
