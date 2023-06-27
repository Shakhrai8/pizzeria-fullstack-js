const pool = require("../databaseConnection");

class Order {
  static async findAll() {
    const result = await pool.query("SELECT * FROM orders");
    return result.rows;
  }

  static async findById(id) {
    const orderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    const order = orderResult.rows[0];

    if (order) {
      const itemsResult = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [id]
      );
      order.items = itemsResult.rows;
    }

    return order;
  }

  static async create({ user_id, status, total_price }) {
    const result = await pool.query(
      "INSERT INTO orders (user_id, status, total_price) VALUES ($1, $2, $3) RETURNING *",
      [user_id, status, total_price]
    );
    return result.rows[0];
  }

  static async update(id, { user_id, status, total_price }) {
    const result = await pool.query(
      "UPDATE orders SET user_id = $1, status = $2, total_price = $3 WHERE id = $4 RETURNING *",
      [user_id, status, total_price, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM orders WHERE id = $1", [id]);
    return result.rowCount > 0;
  }
}

module.exports = Order;
