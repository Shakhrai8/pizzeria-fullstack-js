const pool = require("../databaseConnection");

class OrderItem {
  static async create({ order_id, menu_item_id, quantity }) {
    const result = await pool.query(
      "INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [order_id, menu_item_id, quantity]
    );
    return result.rows[0];
  }

  static async findByOrderId(order_id) {
    const result = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order_id]
    );
    return result.rows;
  }

  // Add other methods as needed
}

module.exports = OrderItem;
