const Firm = require("@models/firm.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");
const SubscriptionPlan = require("@models/subscriptionPlan.model.js");

exports.createFirm = async (req, res) => {
    try {
        console.log("Creating firm with data:", req.body);
        const firm = new Firm(req.body);

        if (req.body.subscriptionPlan) {
            const plan = await SubscriptionPlan.findById(
                req.body.subscriptionPlan,
            );
            if (!plan)
                return res
                    .status(400)
                    .json({ error: "Invalid subscription plan selected" });

            firm.subscription = {
                plan: plan._id,
                startDate: new Date(),
                endDate: new Date(
                    Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000,
                ),
                isActive: true,
            };
        }

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
            .populate("staff")
            .populate("subscription.plan")
            .populate("cases");

        console.log(firms);
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
        const allowedFields = ["name", "address", "email", "phone"];
        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field]) updateData[field] = req.body[field];
        });

        const firm = await Firm.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!firm) return res.status(404).json({ error: "Firm not found" });

        // Update basic fields
        Object.assign(firm, updateData);

        // 🔐 Handle subscription update
        if (req.body.subscriptionPlan) {
            const plan = await SubscriptionPlan.findById(
                req.body.subscriptionPlan,
            );
            if (!plan)
                return res
                    .status(400)
                    .json({ error: "Invalid subscription plan selected" });

            firm.subscription = {
                plan: plan._id,
                startDate: new Date(),
                endDate: new Date(
                    Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000,
                ),
                isActive: true,
            };
        }

        await firm.save();

        // 🧾 Audit log
        const user = await User.findById(req.userId);
        await logAudit({
            user,
            action: "UPDATE_FIRM",
            target: "Firm",
            description: `Updated firm "${firm.name}"`,
            metadata: {
                firmId: firm._id,
                updatedFields: req.body,
            },
        });

        res.json({
            message: "Firm updated successfully",
            firm,
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

exports.getFirmStaffCount = async (req, res) => {
    try {
        console.log("Fetching staff count for firm:", req.params);
        const { firmId } = req.params;

        const count = await User.countDocuments({
            firm: firmId,
            isDeleted: false,
        });

        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
