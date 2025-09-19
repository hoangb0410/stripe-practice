# Mini E-commerce Stripe (Express + PostgreSQL)

## Features

- List Stripe products & prices
- Create customers
- Create Checkout Session (Stripe Checkout)
- Webhook handling to record paid orders
- PostgreSQL to store users and orders (simple)

## Quick start

1. Copy `.env.example` to `.env` and fill values (use Stripe test keys).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create Postgres database and tables (see `db/schema.sql`), or run manually:
   ```sql
   CREATE DATABASE stripe_demo;
   -- then run the SQL in src/db/schema.sql
   ```
4. Start server:
   ```bash
   npm run dev
   ```
5. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:4242/webhook
   ```
