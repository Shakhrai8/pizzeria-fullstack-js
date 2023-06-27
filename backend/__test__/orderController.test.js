const OrderController = require("../controllers/orderController");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

jest.mock("../models/order");
jest.mock("../models/orderItem");

describe("OrderController", () => {
  describe("index", () => {
    test("should get all orders with items", async () => {
      const orders = [
        { id: 1, items: [{ id: 1, name: "Item 1" }] },
        { id: 2, items: [{ id: 2, name: "Item 2" }] },
      ];
      Order.findAll.mockResolvedValue(orders);

      const req = {};
      const res = {
        json: jest.fn(),
      };

      await OrderController.index(req, res);

      expect(Order.findAll).toHaveBeenCalled();
      expect(OrderItem.findByOrderId).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(orders);
    });
  });

  describe("show", () => {
    test("should get an order by ID", async () => {
      const orderId = 1;
      const order = { id: orderId, items: [{ id: 1, name: "Test Item" }] };
      Order.findById.mockResolvedValue(order);

      const req = { params: { id: orderId } };
      const res = {
        json: jest.fn(),
      };

      await OrderController.show(req, res);

      expect(Order.findById).toHaveBeenCalledWith(orderId);
      expect(res.json).toHaveBeenCalledWith(order);
    });
  });

  describe("create", () => {
    test("should create a new order with items", async () => {
      const newOrder = {
        user_id: 1,
        status: "pending",
        total_price: 10.99,
        orderItems: [
          { menu_item_id: 1, quantity: 2 },
          { menu_item_id: 2, quantity: 1 },
        ],
      };
      const createdOrder = { id: 1, ...newOrder };
      Order.create.mockResolvedValue(createdOrder);

      const req = { body: newOrder };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await OrderController.create(req, res);

      expect(Order.create).toHaveBeenCalledWith(newOrder);
      expect(OrderItem.create).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("update", () => {
    test("should update an order", async () => {
      const orderId = 1;
      const updatedOrder = { id: orderId, status: "completed" };
      Order.update.mockResolvedValue(updatedOrder);

      const req = { params: { id: orderId }, body: updatedOrder };
      const res = {
        json: jest.fn(),
      };

      await OrderController.update(req, res);

      expect(Order.update).toHaveBeenCalledWith(orderId, updatedOrder);
      expect(res.json).toHaveBeenCalledWith(updatedOrder);
    });
  });

  describe("delete", () => {
    test("should delete an order", async () => {
      const orderId = 1;
      Order.delete.mockResolvedValue(true);

      const req = { params: { id: orderId } };
      const res = {
        json: jest.fn(),
      };

      await OrderController.delete(req, res);

      expect(Order.delete).toHaveBeenCalledWith(orderId);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
