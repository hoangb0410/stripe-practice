const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /orders?user_id=1
router.get('/', async (req, res) => {
  const { user_id } = req.query;
  try {
    if (user_id) {
      const result = await db.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [user_id]);
      return res.json(result.rows);
    }
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
