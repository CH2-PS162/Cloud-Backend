// presence.js (in models directory)

const db = require('../database/db');

// Function to mark presence
const markPresence = async ({ studentId, courseId, date }) => {
  const connection = await db.getConnection();
  try {
    // Insert presence record into the presence_records table
    const [result] = await connection.execute(
      'INSERT INTO presence_records (studentId, courseId, date) VALUES (?, ?, ?)',
      [studentId, courseId, date || new Date().toISOString()]
    );

    if (result.affectedRows > 0) {
      return { studentId, courseId, date };
    } else {
      throw new Error('Failed to mark presence');
    }
  } catch (error) {
    console.error('Error marking presence:', error);
    throw new Error('Failed to mark presence');
  } finally {
    connection.release();
  }
};

// Function to get presence by date
const getPresenceByDate = async (date) => {
  const connection = await db.getConnection();
  try {
    // Retrieve presence records from the presence_records table
    const [rows] = await connection.execute('SELECT * FROM presence_records WHERE date = ?', [date]);
    return rows;
  } catch (error) {
    console.error('Error retrieving presence records:', error);
    throw new Error('Failed to retrieve presence records');
  } finally {
    connection.release();
  }
};

module.exports = {
  markPresence,
  getPresenceByDate,
};
