const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT || 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((conn) => {
    conn.release();
    logger.info('✅ MySQL pool ready');
  })
  .catch((err) => {
    logger.error('❌ Unable to connect to MySQL', err);
  });

module.exports = pool;

