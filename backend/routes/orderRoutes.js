const express = require("express");
const OrderController = require("../controllers/orderController");

const router = express.Router();

// Get all orders
router.get("/orders", OrderController.index);

// Get a specific order
router.get("/orders/:id", OrderController.show);

// Create a new order
router.post("/orders", OrderController.create);

// Update an order
router.put("/orders/:id", OrderController.update);

// Delete an order
router.delete("/orders/:id", OrderController.delete);

module.exports = router;
