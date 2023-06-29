const express = require("express");
const bodyParser = require("body-parser");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/usersRoutes");
const app = express();

// Use body parser to parse JSON bodies
app.use(bodyParser.json());

// Use your routes
app.use(menuRoutes);
app.use(orderRoutes);
app.use(userRoutes);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Handle other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

module.exports = app;
