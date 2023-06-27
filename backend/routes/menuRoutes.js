const express = require("express");
const MenuController = require("../controllers/menuController");

const router = express.Router();

// Get all menu items
router.get("/menu", MenuController.index);

// Get a specific menu item
router.get("/menu/:id", MenuController.show);

// Create a new menu item
router.post("/menu", MenuController.create);

// Update a menu item
router.put("/menu/:id", MenuController.update);

// Delete a menu item
router.delete("/menu/:id", MenuController.delete);

module.exports = router;
