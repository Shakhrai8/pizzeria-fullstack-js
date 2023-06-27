const User = require("../models/user");

class UsersController {
  static async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  static async show(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    res.json(user);
  }

  static async create(req, res) {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  }

  static async update(req, res) {
    const updatedUser = await User.update(req.params.id, req.body);
    res.json(updatedUser);
  }

  static async delete(req, res) {
    const wasDeleted = await User.delete(req.params.id);
    res.json({ success: wasDeleted });
  }
}

module.exports = UsersController;
