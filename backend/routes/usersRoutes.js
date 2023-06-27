const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");

// Sign Up
router.post("/users/signup", UsersController.signup);

// Log In
router.post("/users/login", UsersController.login);

// Log Out
router.post("/users/logout", UsersController.logout);

// Profile Page
router.get("/users/profile", UsersController.getProfile);

// Update Profile
router.put("/users/profile", UsersController.updateProfile);

// Change Password
router.put("/users/password", UsersController.changePassword);

// Delete Account
router.delete("/users", UsersController.deleteAccount);

module.exports = router;
