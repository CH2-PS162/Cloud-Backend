const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '34.128.114.28',
  user: 'salsa',
  password: 'cobacoba12345',
  database: 'datalms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error('Error getting database connection:', err);
    throw err;
  }
};

module.exports = { getConnection };
