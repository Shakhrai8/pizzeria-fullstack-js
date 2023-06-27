const pool = require("../databaseConnection");

class MenuItem {
  static async findAll() {
    const result = await pool.query("SELECT * FROM menu_items");
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM menu_items WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async create({ name, description, price, ingredients }) {
    const result = await pool.query(
      "INSERT INTO menu_items (name, description, price, ingredients) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, ingredients]
    );
    return result.rows[0];
  }

  static async update(id, { name, description, price, ingredients }) {
    const result = await pool.query(
      "UPDATE menu_items SET name = $1, description = $2, price = $3, ingredients = $4 WHERE id = $5 RETURNING *",
      [name, description, price, ingredients, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM menu_items WHERE id = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }
}

module.exports = MenuItem;
