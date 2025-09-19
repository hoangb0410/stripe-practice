-- Run this SQL after creating the database (stripe_demo)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  product_name VARCHAR(255),
  amount INT,
  currency VARCHAR(10),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
