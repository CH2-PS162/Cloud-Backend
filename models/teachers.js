const { nanoid: generateTeacherID } = require('nanoid');
const db = require('../database/db');

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
    await connection.beginTransaction();

    const [matchingUser] = await connection.execute('SELECT * FROM users WHERE name = ?', [name]);

    if (matchingUser.length > 0) {
      const teacherId = matchingUser[0].user_id;
      console.log('Matching user found. Setting teacherId:', teacherId);
      const [existingTeacher] = await connection.execute('SELECT * FROM teachers WHERE teacherId = ?', [teacherId]);

      if (existingTeacher.length === 0) {
        await connection.execute(
          'INSERT INTO teachers (teacherId, name, dob, address, sex, maritalStatus, yearsofWork, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [teacherId, name, dob || null, address || null, sex || null, maritalStatus || null, yearsofWork || null, description || null]
        );

        for (const courseId of courses) {
          await connection.execute(
            'INSERT INTO teacher_courses (teacherId, courseId) VALUES (?, ?)',
            [teacherId, courseId]
          );
        }

        console.log('Teacher Added:', { teacherId, name, dob, address, sex, maritalStatus, yearsofWork, courses, description });
      } else {

        throw new Error('Duplicate entry for teacherId');
      }
    } else {

      throw new Error('No matching user found');
    }

    await connection.commit();

    const [insertedTeacher] = await connection.execute(
      'SELECT * FROM teachers WHERE teacherId = ?',
      [teacherId]
    );

    const response = {
      success: true,
      message: 'Teacher added successfully',
      data: insertedTeacher[0],
    };

    return response;
  } catch (error) {
    await connection.rollback();
    console.error('Error adding teacher:', error);

    const response = {
      success: false,
      message: 'Failed to add teacher',
      error: error.message,
    };

    throw response;
  } finally {
    connection.release();
  }
};

const deleteTeacher = async (teacherId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM teacher_courses WHERE teacherId = ?', [teacherId]);

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

const updateTeacher = async (teacherId, { name, dob, address, sex, maritalStatus, yearsofWork, courses, description }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE teachers SET name = ?, dob = ?, address = ?, sex = ?, maritalStatus = ?, yearsofWork = ?, description = ? WHERE teacherId = ?',
      [name, dob, address, sex, maritalStatus, yearsofWork, description, teacherId]
    );

    await connection.execute('DELETE FROM teacher_courses WHERE teacherId = ?', [teacherId]);

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
