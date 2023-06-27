const Order = require("../models/order");
const { resetPizzeriaTable, pool } = require("./testHelper");

let client;

beforeAll(async () => {
  client = await pool.connect();
});

beforeEach(() => {
  return resetPizzeriaTable();
});

afterAll(async () => {
  await client.release();
  await pool.end();
});

describe("Order Model", () => {
  test("should list all orders", async () => {
    const orders = await Order.findAll();
    expect(orders).toBeInstanceOf(Array);
  });

  test("should retrieve an order by ID with order items", async () => {
    const order = await Order.findById(1);
    expect(order).toBeInstanceOf(Object);
    expect(order.id).toBe(1);
    expect(order.items).toBeInstanceOf(Array);
  });

  test("should create a new order", async () => {
    const newOrder = {
      user_id: 1,
      status: "pending",
      total_price: 19.99,
    };

    const createdOrder = await Order.create(newOrder);

    expect(createdOrder).toHaveProperty("id");
    expect(createdOrder.user_id).toBe(newOrder.user_id);
    expect(createdOrder.status).toBe(newOrder.status);
    expect(createdOrder.total_price).toBe("19.99");
  });

  test("should update an existing order", async () => {
    const updatedOrder = {
      user_id: 2,
      status: "complete",
      total_price: 29.99,
    };

    const existingOrder = await Order.findById(1);
    const updatedOrderResult = await Order.update(
      existingOrder.id,
      updatedOrder
    );

    expect(updatedOrderResult).toHaveProperty("id");
    expect(updatedOrderResult.user_id).toBe(updatedOrder.user_id);
    expect(updatedOrderResult.status).toBe(updatedOrder.status);
    expect(updatedOrderResult.total_price).toBe("29.99");
  });

  test("should delete an existing order", async () => {
    const existingOrder = await Order.findById(1);
    const deletionResult = await Order.delete(existingOrder.id);

    expect(deletionResult).toBe(true);

    const deletedOrder = await Order.findById(existingOrder.id);
    expect(deletedOrder).toBeUndefined();
  });
});
