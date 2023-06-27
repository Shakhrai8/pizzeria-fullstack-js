const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

class OrderController {
  static async index(req, res) {
    const orders = await Order.findAll();
    for (let order of orders) {
      order.items = await OrderItem.findByOrderId(order.id);
    }
    res.json(orders);
  }

  static async show(req, res) {
    const id = req.params.id;
    const order = await Order.findById(id);
    res.json(order);
  }

  static async create(req, res) {
    const newOrder = await Order.create(req.body);
    for (let item of req.body.orderItems) {
      item.order_id = newOrder.id;
      await OrderItem.create(item);
    }
    const createdOrderWithItems = await Order.findById(newOrder.id);
    res.status(201).json(createdOrderWithItems);
  }

  static async update(req, res) {
    const updatedOrder = await Order.update(req.params.id, req.body);
    res.json(updatedOrder);
  }

  static async delete(req, res) {
    const wasDeleted = await Order.delete(req.params.id);
    res.json({ success: wasDeleted });
  }
}

module.exports = OrderController;
