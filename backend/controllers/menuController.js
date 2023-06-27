const MenuItem = require("../models/menuItem");

class MenuController {
  static async index(req, res) {
    const menuItems = await MenuItem.findAll();
    res.json(menuItems);
  }

  static async show(req, res) {
    const id = req.params.id;
    const menuItem = await MenuItem.findById(id);
    res.json(menuItem);
  }

  static async create(req, res) {
    const newMenuItem = await MenuItem.create(req.body);
    res.status(201).json(newMenuItem);
  }

  static async update(req, res) {
    const updatedMenuItem = await MenuItem.update(req.params.id, req.body);
    res.json(updatedMenuItem);
  }

  static async delete(req, res) {
    const wasDeleted = await MenuItem.delete(req.params.id);
    res.json({ success: wasDeleted });
  }
}

module.exports = MenuController;
