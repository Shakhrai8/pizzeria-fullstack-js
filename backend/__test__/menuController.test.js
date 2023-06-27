const MenuController = require("../controllers/menuController");
const MenuItem = require("../models/menuItem");

jest.mock("../models/menuItem");

describe("MenuController", () => {
  describe("index", () => {
    test("should get all menu items", async () => {
      const menuItems = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];
      MenuItem.findAll.mockResolvedValue(menuItems);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await MenuController.index(req, res);

      expect(MenuItem.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(menuItems);
    });
  });

  describe("show", () => {
    test("should get a menu item by ID", async () => {
      const menuItemId = 1;
      const menuItem = { id: menuItemId, name: "Test Item" };
      MenuItem.findById.mockResolvedValue(menuItem);

      const req = { params: { id: menuItemId } };
      const res = {
        json: jest.fn(),
      };

      await MenuController.show(req, res);

      expect(MenuItem.findById).toHaveBeenCalledWith(menuItemId);
      expect(res.json).toHaveBeenCalledWith(menuItem);
    });
  });

  describe("create", () => {
    test("should create a new menu item", async () => {
      const newMenuItem = { name: "New Item" };
      const createdMenuItem = { id: 1, name: "New Item" };
      MenuItem.create.mockResolvedValue(createdMenuItem);

      const req = { body: newMenuItem };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MenuController.create(req, res);

      expect(MenuItem.create).toHaveBeenCalledWith(newMenuItem);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdMenuItem);
    });
  });

  describe("update", () => {
    test("should update a menu item", async () => {
      const menuItemId = 1;
      const updatedMenuItem = { id: menuItemId, name: "Updated Item" };
      MenuItem.update.mockResolvedValue(updatedMenuItem);

      const req = { params: { id: menuItemId }, body: updatedMenuItem };
      const res = {
        json: jest.fn(),
      };

      await MenuController.update(req, res);

      expect(MenuItem.update).toHaveBeenCalledWith(menuItemId, updatedMenuItem);
      expect(res.json).toHaveBeenCalledWith(updatedMenuItem);
    });
  });

  describe("delete", () => {
    test("should delete a menu item", async () => {
      const menuItemId = 1;
      MenuItem.delete.mockResolvedValue(true);

      const req = { params: { id: menuItemId } };
      const res = {
        json: jest.fn(),
      };

      await MenuController.delete(req, res);

      expect(MenuItem.delete).toHaveBeenCalledWith(menuItemId);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
