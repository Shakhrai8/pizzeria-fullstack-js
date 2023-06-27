const OrderItem = require("../models/orderItem");
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

describe("OrderItem Model", () => {
  test("should create a new order item", async () => {
    const newOrderItem = {
      order_id: 1,
      menu_item_id: 1,
      quantity: 2,
    };

    const createdOrderItem = await OrderItem.create(newOrderItem);

    expect(createdOrderItem).toHaveProperty("id");
    expect(createdOrderItem.order_id).toBe(newOrderItem.order_id);
    expect(createdOrderItem.menu_item_id).toBe(newOrderItem.menu_item_id);
    expect(createdOrderItem.quantity).toBe(newOrderItem.quantity);
  });

  test("should retrieve order items by order ID", async () => {
    const orderItems = await OrderItem.findByOrderId(1);

    expect(orderItems).toBeInstanceOf(Array);
    expect(orderItems.length).toBe(1);
  });

  // Add more test cases as needed
});
