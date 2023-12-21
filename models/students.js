const { nanoid: generateStudentId } = require('nanoid');
const db = require('../database/db');

let students = [];

const generateStudentID = () => {
  return generateStudentId(8);
};

const getAllStudents = async (page = 1, pageSize = 8) => {
  const connection = await db.getConnection();
  try {
    const offset = (page - 1) * pageSize;
    const [rows] = await connection.execute(
      'SELECT * FROM students LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving students:', error);
    throw new Error('Failed to retrieve students');
  } finally {
    connection.release();
  }
};

const addStudent = async ({ studentName, email, age = [] }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [matchingUser] = await connection.execute('SELECT * FROM users WHERE name = ?', [studentName]);

    if (matchingUser.length > 0) {
      const studentId = matchingUser[0].user_id;
      console.log('Matching user found. Setting studentId:', studentId);

      const [existingStudent] = await connection.execute('SELECT * FROM students WHERE studentId = ?', [studentId]);

      if (existingStudent.length === 0) {
        await connection.execute(
          'INSERT INTO students (studentId, studentName, email, age) VALUES (?, ?, ?, ?)',
          [studentId, studentName, email, age]
        );

        console.log('Student Added:', { studentId, studentName, email, age });
      } else {
        throw new Error('Duplicate entry for studentId');
      }
    } else {
      throw new Error('No matching user found');
    }

    await connection.commit();

    const [insertedStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    const response = {
      success: true,
      message: 'Student added successfully',
      data: insertedStudent[0], 
    };

    return response;
  } catch (error) {
    await connection.rollback();
    console.error('Error adding student:', error);

    const response = {
      success: false,
      message: 'Failed to add student',
      error: error.message, 
    };

    throw response;
  } finally {
    connection.release();
  }
};

const deleteStudent = async (studentId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    if (existingStudent.length === 0) {
      return false;
    }

    await connection.execute('DELETE FROM student_courses WHERE studentId = ?', [studentId]);

    const [deletedStudent] = await connection.execute(
      'DELETE FROM students WHERE studentId = ?',
      [studentId]
    );

    await connection.commit();

    return deletedStudent.affectedRows > 0; 
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    throw new Error('Failed to delete student');
  } finally {
    connection.release();
  }
};

const updateStudent = async (studentId, { studentName, email, age, courses }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE students SET studentName = ?, email = ?, age = ? WHERE studentId = ?',
      [studentName, email, age, studentId]
    );

    await connection.execute('DELETE FROM student_courses WHERE studentId = ?', [studentId]);

    for (const courseId of courses) {
      const [course] = await connection.execute('SELECT * FROM courses WHERE courseId = ?', [courseId]);

      if (course.length > 0) {
        await connection.execute(
          'INSERT INTO student_courses (studentId, courseId) VALUES (?, ?)',
          [studentId, courseId]
        );
      } else {
        console.error(`Course with courseId ${courseId} does not exist`);
      }
    }

    await connection.commit();

    const [updatedStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    return updatedStudent[0]; 
  } catch (error) {
    await connection.rollback();
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
  } finally {
    connection.release();
  }
};

const getCoursesForStudent = async (studentId) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM student_courses WHERE studentId = ?',
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving courses for the student:', error);
    throw new Error('Failed to retrieve courses for the student');
  } finally {
    connection.release();
  }
};


module.exports = {
  generateStudentID,
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getCoursesForStudent,
};