const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

// POST /customers { email }
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    const customer = await stripe.customers.create({ email });
    const result = await db.query(
      'INSERT INTO users(email, stripe_customer_id) VALUES($1,$2) RETURNING *',
      [email, customer.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
