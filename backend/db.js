// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, // VPS IP or localhost
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // SSL support if needed
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL Connected Successfully!");
    client.release(); // Release client back to pool
  })
  .catch(err => console.error("❌ PostgreSQL Connection Error: ", err));

module.exports = pool;
