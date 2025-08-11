const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
    console.log(req.body);

    console.log("Received request to create checkout session");

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
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
