require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productsRoute = require("./routes/products");
const checkoutRoute = require("./routes/checkout");
const customersRoute = require("./routes/customers");
const webhookRoute = require("./routes/webhook");
const ordersRoute = require("./routes/orders");

const app = express();
app.use(cors());
// For webhook we need raw body; other routes use json
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/webhook")) {
    return next();
  }
  bodyParser.json()(req, res, next);
});

app.use("/products", productsRoute);
app.use("/checkout", checkoutRoute);
app.use("/customers", customersRoute);
app.use("/webhook", webhookRoute);
app.use("/orders", ordersRoute);
app.get("/success", (req, res) => {
  res.json({
    success: true,
    message: "Payment successful",
    sessionId: req.query.session_id,
  });
});

app.get("/cancel", (req, res) => {
  res.json({
    success: false,
    message: "Payment cancelled",
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
