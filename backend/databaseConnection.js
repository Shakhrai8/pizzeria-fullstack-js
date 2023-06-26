const { Pool } = require("pg");

let pool;

if (process.env.NODE_ENV === "production") {
  // If running in production, use the DATABASE_URL environment variable
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // If running in development or other environments, use local database configuration
  pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "pizzeria_js",
  });
}

module.exports = pool;
