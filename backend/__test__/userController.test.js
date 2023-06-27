const UsersController = require("../controllers/usersController");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/user");
jest.mock("bcrypt");

describe("UsersController", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("signup", () => {
    test("should create a new user on signup", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          name: "John Doe",
          username: "johndoe",
          address: "123 Main St",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const hashedPassword = "hashedpassword";
      const newUser = {
        id: 1,
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      };

      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(newUser);

      await UsersController.signup(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    test("should return an error if the email already exists", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
          name: "John Doe",
          username: "johndoe",
          address: "123 Main St",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByEmail.mockResolvedValue({
        id: 1,
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      });

      await UsersController.signup(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email already exists",
      });
    });
  });

  describe("login", () => {
    test("should login a user with valid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        json: jest.fn(),
      };

      const user = {
        id: 1,
        email: req.body.email,
        password: "hashedpassword",
      };

      User.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      const token = "jwt-token";
      jest.spyOn(jwt, "sign").mockReturnValue(token);

      await UsersController.login(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        user.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id },
        "your-secret-key",
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    test("should return an error for invalid email or password", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByEmail.mockResolvedValue(null);

      await UsersController.login(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByEmail.mockRejectedValue(new Error("Database error"));

      await UsersController.login(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("logout", () => {
    test("should log out the user", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };

      await UsersController.logout(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });
  });

  describe("getProfile", () => {
    test("should get the user's profile", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        json: jest.fn(),
      };

      const user = {
        id: req.userId,
        name: "John Doe",
        email: "test@example.com",
        username: "johndoe",
        address: "123 Main St",
      };

      User.findById.mockResolvedValue(user);

      await UsersController.getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("should return an error if the user is not found", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(null);

      await UsersController.getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockRejectedValue(new Error("Database error"));

      await UsersController.getProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateProfile", () => {
    test("should update the user's profile", async () => {
      const req = {
        userId: 1,
        body: {
          email: "test@example.com",
          name: "John Doe",
          username: "johndoe",
          address: "123 Main St",
        },
      };
      const res = {
        json: jest.fn(),
      };

      const updatedUser = {
        id: req.userId,
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      };

      User.update.mockResolvedValue(updatedUser);

      await UsersController.updateProfile(req, res);

      expect(User.update).toHaveBeenCalledWith(req.userId, {
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      });
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("should handle internal server error", async () => {
      const req = {
        userId: 1,
        body: {
          email: "test@example.com",
          name: "John Doe",
          username: "johndoe",
          address: "123 Main St",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.update = jest.fn().mockRejectedValue(new Error("Database error"));

      await UsersController.updateProfile(req, res);

      expect(User.update).toHaveBeenCalledWith(req.userId, {
        email: req.body.email,
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("changePassword", () => {
    test("should change the user's password", async () => {
      const req = {
        userId: 1,
        body: {
          currentPassword: "oldpassword",
          newPassword: "newpassword",
        },
      };
      const res = {
        json: jest.fn(),
      };

      const user = {
        id: req.userId,
        password: "hashedpassword",
      };

      User.findById.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashednewpassword");
      const updatedUser = {
        id: req.userId,
        password: "hashednewpassword",
      };
      User.update.mockResolvedValue(updatedUser);

      await UsersController.changePassword(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.currentPassword,
        user.password
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.newPassword, 10);
      expect(User.update).toHaveBeenCalledWith(req.userId, {
        password: "hashednewpassword",
      });
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("should return an error if the user is not found", async () => {
      const req = {
        userId: 1,
        body: {
          currentPassword: "oldpassword",
          newPassword: "newpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(null);

      await UsersController.changePassword(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    test("should return an error for invalid current password", async () => {
      const req = {
        userId: 1,
        body: {
          currentPassword: "oldpassword",
          newPassword: "newpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        id: req.userId,
        password: "hashedpassword",
      };

      User.findById.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await UsersController.changePassword(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.currentPassword,
        user.password
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid current password",
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        userId: 1,
        body: {
          currentPassword: "oldpassword",
          newPassword: "newpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockRejectedValue(new Error("Database error"));

      await UsersController.changePassword(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("deleteAccount", () => {
    test("should delete the user's account", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        json: jest.fn(),
      };

      User.delete.mockResolvedValue(true);

      await UsersController.deleteAccount(req, res);

      expect(User.delete).toHaveBeenCalledWith(req.userId);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test("should return an error if the user is not found", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.delete.mockResolvedValue(false);

      await UsersController.deleteAccount(req, res);

      expect(User.delete).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    test("should handle internal server error", async () => {
      const req = {
        userId: 1,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.delete.mockRejectedValue(new Error("Database error"));

      await UsersController.deleteAccount(req, res);

      expect(User.delete).toHaveBeenCalledWith(req.userId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
