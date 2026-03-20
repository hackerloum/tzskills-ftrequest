const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const useSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';
const sslStrict = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'feature_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 15000,
  ...(useSsl && {
    ssl: sslStrict ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
  }),
});

module.exports = pool;
