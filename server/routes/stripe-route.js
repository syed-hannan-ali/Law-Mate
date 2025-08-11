const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const User = require("@models/user.model");
const Firm = require("@models/firm.model");
const verifyToken = require("@middleware/auth.middleware");
const router = express.Router();

router.post("/create-checkout-session", verifyToken, async (req, res) => {
    console.log("Received request to create checkout session");

    const user = await User.findById(req.userId);

    const firm = user.firm;

    if (!firm) {
        return res
            .status(400)
            .json({ error: "User does not belong to a firm" });
    }

    const priceId = req.body.stripeId;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `http://localhost:5173/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/`,
            metadata: {
                firmId: firm._id.toString(), // so you know who to update
            },
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/success", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const firm = await Firm.findById(user.firm);
        const plan = req.body.plan;

        if (!firm) {
            return res.status(400).json({ error: "Firm not found" });
        }

        // Update the firm's plan
        firm.subscription.plan = plan._id;
        firm.subscription.startDate = new Date();
        firm.subscription.endDate = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000, // duration in days
        );
        firm.subscription.isActive = true;

        await firm.save();

        console.log("Firm subscription updated successfully");
        res.status(200).json({ message: "Subscription updated successfully" });
    } catch (error) {
        console.error("Payment success handler error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
