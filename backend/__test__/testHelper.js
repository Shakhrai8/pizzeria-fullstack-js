const fs = require("fs");
const path = require("path");
const pool = require("../databaseConnection");

function resetPizzeriaTable() {
  const seedSql = fs.readFileSync(
    path.join(__dirname, "..", "utils", "seed.sql"),
    "utf8"
  );

  return pool
    .query(seedSql)
    .then(() => console.log("Database reset successful"))
    .catch((err) => console.error("Database reset failed", err));
}

module.exports = { resetPizzeriaTable, pool };
