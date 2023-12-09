const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '34.128.114.28',
  user: 'salsa',
  password: 'cobacoba12345',
  database: 'datalms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
