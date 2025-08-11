const Firm = require("@models/firm.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");
const SubscriptionPlan = require("@models/subscriptionPlan.model.js");

exports.createFirm = async (req, res) => {
    try {
        console.log("Creating firm with data:", req.body);

        // 1️⃣ Find logged-in user (based on email from req.user)
        console.log("Finding user by email:", req.body.email);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: "Owner user not found" });
        }

        // 2️⃣ Create Firm instance and assign owner & staff automatically
        const firm = new Firm({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email, // firm's own email
            phone: req.body.phone,
            owner: user._id, // logged-in user becomes owner
            staff: [user._id], // also added to staff list
        });

        // 3️⃣ If subscription plan is provided, attach it
        if (req.body.subscriptionPlan) {
            const plan = await SubscriptionPlan.findById(
                req.body.subscriptionPlan,
            );
            if (!plan) {
                return res
                    .status(400)
                    .json({ error: "Invalid subscription plan selected" });
            }

            firm.subscription = {
                plan: plan._id,
                startDate: new Date(),
                endDate: new Date(
                    Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000,
                ),
                isActive: true,
            };
        }

        // 4️⃣ Save the firm
        const savedFirm = await firm.save();

        // 5️⃣ Link the firm to the user record
        user.firm = savedFirm._id;
        await user.save();

        // 6️⃣ Audit log
        await logAudit({
            user,
            action: "CREATE_FIRM",
            target: "Firm",
            description: `Firm "${savedFirm.name}" was created by ${user.username}`,
            metadata: { firmId: savedFirm._id },
        });

        // 7️⃣ Send response
        res.status(201).json({
            message: "Firm created successfully",
            firm: savedFirm,
        });
    } catch (err) {
        console.error(err);
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

exports.getFirmStaff = async (req, res) => {
    console.log("Fetching staff for firm:", req.userId);
    try {
        const user = await User.findById(req.userId);

        const firmId = user.firm;
        if (!firmId) {
            return res
                .status(404)
                .json({ message: "User does not belong to any firm." });
        }

        const staff = await User.find({ firm: firmId, isDeleted: false });

        if (!staff.length) {
            return res
                .status(404)
                .json({ message: "No staff found for this firm." });
        }

        res.json(staff);
    } catch (error) {
        console.error("Error fetching firm staff:", error);
        res.status(500).json({ message: "Server error while fetching staff." });
    }
};
