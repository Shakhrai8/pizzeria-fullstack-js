const UsersController = require("../controllers/usersController");
const User = require("../models/user");

jest.mock("../models/user");

describe("UsersController", () => {
  describe("index", () => {
    test("should get all users", async () => {
      const users = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ];
      User.findAll.mockResolvedValue(users);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await UsersController.index(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("show", () => {
    test("should get a user by ID", async () => {
      const userId = 1;
      const user = { id: userId, name: "Test User" };
      User.findById.mockResolvedValue(user);

      const req = { params: { id: userId } };
      const res = {
        json: jest.fn(),
      };

      await UsersController.show(req, res);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("create", () => {
    test("should create a new user", async () => {
      const newUser = { name: "New User" };
      const createdUser = { id: 1, name: "New User" };
      User.create.mockResolvedValue(createdUser);

      const req = { body: newUser };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsersController.create(req, res);

      expect(User.create).toHaveBeenCalledWith(newUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });
  });

  describe("update", () => {
    test("should update a user", async () => {
      const userId = 1;
      const updatedUser = { id: userId, name: "Updated User" };
      User.update.mockResolvedValue(updatedUser);

      const req = { params: { id: userId }, body: updatedUser };
      const res = {
        json: jest.fn(),
      };

      await UsersController.update(req, res);

      expect(User.update).toHaveBeenCalledWith(userId, updatedUser);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe("delete", () => {
    test("should delete a user", async () => {
      const userId = 1;
      User.delete.mockResolvedValue(true);

      const req = { params: { id: userId } };
      const res = {
        json: jest.fn(),
      };

      await UsersController.delete(req, res);

      expect(User.delete).toHaveBeenCalledWith(userId);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
