// server/src/config/database.js
// Knex + mysql2 connection used by controllers
require('dotenv').config();

const knex = require('knex');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD,
  DB_PASS,
  DB_NAME = 'attendance_db'
} = process.env;

const db = knex({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD ?? DB_PASS ?? '',
    database: DB_NAME
  },
  pool: { min: 0, max: 10 },
  acquireConnectionTimeout: 60000
});

module.exports = db;
