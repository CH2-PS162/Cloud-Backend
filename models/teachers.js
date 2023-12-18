const { nanoid: generateTeacherID } = require('nanoid');
const db = require('../database/db');

// Function to get all teachers
const getAllTeachers = async (page = 1, pageSize = 8) => {
  const connection = await db.getConnection();
  try {
    const offset = (page - 1) * pageSize;
    const [rows] = await connection.execute(
      'SELECT * FROM teachers LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving teachers:', error);
    throw new Error('Failed to retrieve teachers');
  } finally {
    connection.release();
  }
};

// Function to add teachers
const addTeacher = async ({ name, dob, address, sex, maritalStatus, yearsofWork, courses, description }) => {
  const connection = await db.getConnection();
  try {
    const teacherId = generateTeacherID();

    // Handle undefined or null values
    const params = [teacherId, name || null, dob || null, address || null, sex || null, maritalStatus || null, yearsofWork || null, description || null];

    // Insert teacher into the teachers table
    await connection.execute(
      'INSERT INTO teachers (teacherId, name, dob, address, sex, maritalStatus, yearsofWork, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      params
    );

    // Insert associations into the teacher_courses table
    for (const courseId of courses) {
      await connection.execute(
        'INSERT INTO teacher_courses (teacherId, courseId) VALUES (?, ?)',
        [teacherId, courseId]
      );
    }

    return { teacherId, name, dob, address, sex, maritalStatus, yearsofWork, courses, description };
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw new Error('Failed to add teacher');
  } finally {
    connection.release();
  }
};

// Function to delete teacher
const deleteTeacher = async (teacherId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Delete associations from the teacher_courses table
    await connection.execute('DELETE FROM teacher_courses WHERE teacherId = ?', [teacherId]);

    // Delete the teacher from the teachers table
    const [result] = await connection.execute('DELETE FROM teachers WHERE teacherId = ?', [teacherId]);

    await connection.commit();

    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting teacher:', error);
    throw new Error('Failed to delete teacher');
  } finally {
    connection.release();
  }
};

// Function to update teacher
const updateTeacher = async (teacherId, { name, dob, address, sex, maritalStatus, yearsofWork, courses, description }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Update teacher details in the teachers table
    await connection.execute(
      'UPDATE teachers SET name = ?, dob = ?, address = ?, sex = ?, maritalStatus = ?, yearsofWork = ?, description = ? WHERE teacherId = ?',
      [name, dob, address, sex, maritalStatus, yearsofWork, description, teacherId]
    );

    // Clear existing associations for the teacher in the teacher_courses table
    await connection.execute('DELETE FROM teacher_courses WHERE teacherId = ?', [teacherId]);

    // Insert updated associations into the teacher_courses table
    for (const courseId of courses) {
      await connection.execute(
        'INSERT INTO teacher_courses (teacherId, courseId) VALUES (?, ?)',
        [teacherId, courseId]
      );
    }

    await connection.commit();

    return { teacherId, name, dob, address, sex, maritalStatus, yearsofWork, courses, description };
  } catch (error) {
    await connection.rollback();
    console.error('Error updating teacher:', error);
    throw new Error('Failed to update teacher');
  } finally {
    connection.release();
  }
};

// Function to get courses for a teacher
const getCoursesForTeacher = async (teacherId) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM teacher_courses WHERE teacherId = ?',
      [teacherId]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving courses for the teacher:', error);
    throw new Error('Failed to retrieve courses for the teacher');
  } finally {
    connection.release();
  }
};

module.exports = {
  generateTeacherID,
  getAllTeachers,
  addTeacher,
  deleteTeacher,
  updateTeacher,
  getCoursesForTeacher,
};
