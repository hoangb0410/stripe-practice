const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = require('../db');

// raw body required
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook construct error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const amount = session.amount_total;
    const currency = session.currency;

    try {
      const user = await db.query('SELECT id FROM users WHERE stripe_customer_id=$1', [customerId]);
      if (user.rows.length > 0) {
        await db.query(
          'INSERT INTO orders(user_id, product_name, amount, currency, status) VALUES($1,$2,$3,$4,$5)',
          [user.rows[0].id, 'Sample Product', amount, currency, 'paid']
        );
      } else {
        // optional: create a user-less order or log
        console.log('Customer not found in DB:', customerId);
      }
    } catch (err) {
      console.error('DB error on webhook', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
