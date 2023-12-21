const db = require('../database/db');

const markPresenceInDatabase = async ({ studentId, courseId, date }) => {
  const connection = await db.getConnection();
  try {

    const [studentInfo] = await connection.execute(
      'SELECT studentName FROM student_courses WHERE studentId = ? AND courseId = ?',
      [studentId, courseId]
    );

    const [teacherInfo] = await connection.execute(
      'SELECT teacherId, teacherName, courseName FROM teacher_courses WHERE courseId = ?',
      [courseId]
    );

    if (studentId !== undefined && courseId !== undefined && date !== undefined) {
      console.log('Parameters:', { studentId, courseId, date }); 

      const [result] = await connection.execute(
        'INSERT INTO presence_records (studentId, courseId, date, studentName, courseName, teacherId, teacherName) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          studentId,
          courseId,
          date,
          studentInfo[0]?.studentName || null,
          teacherInfo[0]?.courseName || null,
          teacherInfo[0]?.teacherId || null,
          teacherInfo[0]?.teacherName || null,
        ]
      );

      if (result.affectedRows > 0) {
        return { studentId, courseId, date };
      } else {
        throw new Error('Failed to mark presence');
      }
    } else {
      throw new Error('One or more parameters are undefined');
    }
  } catch (error) {
    console.error('Error marking presence:', error);
    throw new Error('Failed to mark presence');
  } finally {
    connection.release();
  }
};

const getAllPresence = async (studentId) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM presence_records WHERE studentId = ?', [studentId]);
    return rows;
  } catch (error) {
    console.error('Error retrieving presence records:', error);
    throw new Error('Failed to retrieve presence records');
  } finally {
    connection.release();
  }
};

const getPresenceByDate = async (studentId, date) => {
  try {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const query = 'SELECT * FROM presence_records WHERE studentId = ? AND date = ?';
    
    const [presenceRecords] = await db.execute(query, [studentId, formattedDate]);

    return presenceRecords;
  } catch (error) {
    console.error('Error fetching presence records:', error);
    throw new Error('Failed to fetch presence records');
  }
};

module.exports = {
  markPresenceInDatabase,
  getPresenceByDate,
  getAllPresence,
};
