const pool = require("../databaseConnection");
const bcrypt = require("bcrypt");

class User {
  static async findAll() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async create({ email, password, name, username, address }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, name, username, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, hashedPassword, name, username, address]
    );
    return result.rows[0];
  }

  static async update(id, { email, password, name, username, address }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "UPDATE users SET email = $1, password = $2, name = $3, username = $4, address = $5 WHERE id = $6 RETURNING *",
      [email, hashedPassword, name, username, address, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount > 0;
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }
}

module.exports = User;
