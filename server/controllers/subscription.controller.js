const SubscriptionPlan = require("@models/subscriptionPlan.model");
const Firm = require("@models/firm.model");

// Create a new subscription plan
exports.createSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, durationInDays, features } = req.body;

        // Basic validation
        if (!name || price==null || !durationInDays) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newPlan = new SubscriptionPlan({
            name,
            price,
            durationInDays,
            features,
        });

        await newPlan.save();

        res.status(201).json({
            message: "Subscription plan created",
            plan: newPlan,
        });
    } catch (err) {
        console.error("Error creating subscription plan:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.editSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, durationInDays, features } = req.body;

        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            id,
            {
                name,
                price,
                durationInDays,
                features,
            },
            { new: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: "Subscription plan not found" });
        }

        res.status(200).json(updatedPlan);
    } catch (err) {
        console.error("Error updating subscription plan:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Assign a subscription plan to a firm
exports.assignSubscriptionToFirm = async (req, res) => {
    try {
        const { firmId, planId } = req.body;

        const plan = await SubscriptionPlan.findById(planId);
        const firm = await Firm.findById(firmId);

        if (!plan || !firm) {
            return res.status(404).json({ message: "Firm or Plan not found" });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.durationInDays);

        firm.subscription = {
            plan: plan._id,
            startDate,
            endDate,
            isActive: true,
        };

        await firm.save();

        res.status(200).json({
            message: "Subscription assigned to firm",
            subscription: firm.subscription,
        });
    } catch (err) {
        console.error("Error assigning subscription:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllSubscriptions = async (req, res) => {
    console.log("Fetching all subscriptions");
    try {
        const plans = await SubscriptionPlan.find().sort({ price: 1 });;
        console.log("total plans found:", plans.length);
        res.status(200).json(plans);
    } catch (err) {
        console.error("Error fetching subscriptions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SubscriptionPlan.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (err) {
        console.error("Error deleting subscription:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};