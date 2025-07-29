const Firm = require("@models/firm.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");

exports.createFirm = async (req, res) => {
    try {
        console.log(req.body)
        const firm = new Firm(req.body);
        console.log(firm)
        const saved = await firm.save();

        const user = await User.findById(req.userId);
        await logAudit({
            user,
            action: "CREATE_FIRM",
            target: "Firm",
            description: `Firm "${saved.name}" was created by ${user.username}`,
            metadata: { firmId: saved._id },
        });

        res.status(201).json({
            message: "Firm created successfully",
            firm: saved,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllFirms = async (req, res) => {
    try {
        const firms = await Firm.find({ isDeleted: false })
            .populate("lawyers")
            .populate("cases"); 

        console.log(firms)

        res.json(firms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFirmById = async (req, res) => {
    try {
        const firm = await Firm.findOne({
            _id: req.params.id,
            isDeleted: false,
        })
            .populate("users")
            .populate("cases");

        if (!firm) return res.status(404).json({ error: "Firm not found" });

        res.json(firm);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFirm = async (req, res) => {
    try {
        const updated = await Firm.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true },
        );

        if (!updated) return res.status(404).json({ error: "Firm not found" });

        const user = await User.findById(req.userId);
        await logAudit({
            user,
            action: "UPDATE_FIRM",
            target: "Firm",
            description: `Updated firm "${updated.name}"`,
            metadata: {
                firmId: updated._id,
                updatedFields: req.body,
            },
        });

        res.json({
            message: "Firm updated successfully",
            firm: updated,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteFirm = async (req, res) => {
    try {
        const deleted = await Firm.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true },
        );

        if (!deleted) return res.status(404).json({ error: "Firm not found" });

        const user = await User.findById(req.userId);
        await logAudit({
            user,
            action: "DELETE_FIRM",
            target: "Firm",
            description: `Firm "${deleted.name}" was soft-deleted`,
            metadata: {
                firmId: deleted._id,
                deletedAt: new Date(),
            },
        });

        res.json({ message: "Firm deleted (soft) successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
