const db = require('../database/db');

const getAllUsers = async () => {
  let connection;
  try {
    connection = await db.getConnection(); 
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = { getAllUsers };
