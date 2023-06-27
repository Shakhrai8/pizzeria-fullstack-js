const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsersController {
  static async signup(req, res) {
    try {
      const { email, password, name, username, address } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        username,
        address,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async logout(req, res) {
    try {
      // Perform any necessary actions to log out the user (e.g., invalidating tokens)
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.userId; // Extracted from the authentication middleware
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.userId; // Extracted from the authentication middleware
      const { email, name, username, address } = req.body;
      const updatedUser = await User.update(userId, {
        email,
        name,
        username,
        address,
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.userId; // Extracted from the authentication middleware
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: "Invalid current password" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.update(userId, {
        password: hashedNewPassword,
      });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const userId = req.userId; // Extracted from the authentication middleware
      const isDeleted = await User.delete(userId);
      if (!isDeleted) {
        return res.status(404).json({ error: "User not found" });
      }
      // Perform any necessary actions to delete associated data (e.g., orders)
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = UsersController;
