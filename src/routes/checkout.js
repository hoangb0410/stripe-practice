const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /checkout { priceId, customerId (optional) }
router.post("/", async (req, res) => {
  const { priceId, customerId } = req.body;
  if (!priceId) return res.status(400).json({ error: "priceId required" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId || undefined,
      line_items: [
        {
          price: priceId, // recurring price
          quantity: 1,
        },
      ],
      success_url:
        "https://3a54664d487a.ngrok-free.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://3a54664d487a.ngrok-free.app/cancel",
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
