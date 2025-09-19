const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GET /products
router.get('/', async (req, res) => {
  try {
    const products = await stripe.products.list({ limit: 10 });
    const prices = await stripe.prices.list({ limit: 20 });
    res.json({ products: products.data, prices: prices.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
