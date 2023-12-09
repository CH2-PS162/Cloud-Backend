const { nanoid: generateID } = require('nanoid');
const db = require('../database/db');

// Function to generate a unique course ID
const generateCourseID = () => {
  return generateID(10);; // Generating a unique 10-character ID using nanoid
};


// Function to get all courses
const getAllCourses = async () => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM courses');
    return rows;
  } catch (error) {
    console.error('Error retrieving courses:', error);
    throw new Error('Failed to retrieve courses');
  } finally {
    connection.release();
  }
};


// Function to create a course
const createCourse = async ({ courseName, instructorId, schedule, description }) => {
  const connection = await db.getConnection();
  try {
    // Reset the auto-increment counter to start from 1
    await connection.execute('ALTER TABLE courses AUTO_INCREMENT = 1');

    // Generate a new course ID
    const courseId = await generateCourseID();

    // Insert the new course
    await connection.execute(
      'INSERT INTO courses (courseId, courseName, instructorId, schedule, description) VALUES (?, ?, ?, ?, ?)',
      [courseId, courseName, instructorId, schedule, description]
    );

    // Return the course details
    return { courseId, courseName, instructorId, schedule, description };
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Failed to create course');
  } finally {
    connection.release();
  }
};

// Function to delete a course
const deleteCourse = async (courseId) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute('DELETE FROM courses WHERE courseId = ?', [courseId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course');
  } finally {
    connection.release();
  }
};

// Function to update a course
const updateCourse = async (courseId, { courseName, instructorId, schedule, description }) => {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE courses SET courseName = ?, instructorId = ?, schedule = ?, description = ? WHERE courseId = ?',
      [courseName, instructorId, schedule, description, courseId]
    );
    return { courseId, courseName, instructorId, schedule, description };
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Failed to update course');
  } finally {
    connection.release();
  }
};

module.exports = {
  generateCourseID,
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,
};
