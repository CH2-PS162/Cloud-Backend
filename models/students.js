const { nanoid: generateStudentId } = require('nanoid');
const db = require('../database/db');

let students = [];

const generateStudentID = () => {
  return generateStudentId(8); // Generating a unique 8-character ID using nanoid
};

// Function to get all students
const getAllStudents = async () => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM students');
    return rows; // rows will be an empty array if there are no students
  } catch (error) {
    console.error('Error retrieving students:', error);
    throw new Error('Failed to retrieve students');
  } finally {
    connection.release();
  }
};

// Function to add a student
const addStudent = async ({ studentName, email, age, courses = [] }) => {
  const connection = await db.getConnection();

  try {
    const studentId = generateStudentID(); // Use the function from the module
    console.log('Generated Student ID:', studentId);

    await connection.beginTransaction();

    // Insert student into the students table
    const [studentInsertResult] = await connection.execute(
      'INSERT INTO students (studentId, studentName, email, age) VALUES (?, ?, ?, ?)',
      [studentId, studentName, email, age]
    );
    console.log('Student Added:', { studentId, studentName, email, age });

    // Insert courses for the student into the student_courses table
    for (const courseId of courses) {
      // Check if the courseId exists in the courses table
      const [course] = await connection.execute('SELECT * FROM courses WHERE courseId = ?', [courseId]);

      if (course.length > 0) {
        // If the course exists, insert into the student_courses table
        await connection.execute(
          'INSERT INTO student_courses (studentId, courseId) VALUES (?, ?)',
          [studentId, courseId]
        );
        console.log('Association Added:', { studentId, courseId });
      } else {
        // If the course doesn't exist, you might want to handle this case based on your requirements
        console.error(`Course with courseId ${courseId} does not exist`);
      }
    }

    await connection.commit();

    // Fetch the inserted student
    const [insertedStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    const response = {
      success: true,
      message: 'Student added successfully',
      data: insertedStudent[0], // Return the inserted student
    };

    return response;
  } catch (error) {
    await connection.rollback();
    console.error('Error adding student:', error);

    const response = {
      success: false,
      message: 'Failed to add student',
      error: error.message, // Include the error message in the response
    };

    throw response;
  } finally {
    connection.release();
  }
};

// Function to delete a student
const deleteStudent = async (studentId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if the studentId exists in the students table
    const [existingStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    if (existingStudent.length === 0) {
      // If no student with the given studentId is found, return false
      return false;
    }

    // Delete associations from the student_courses table
    await connection.execute('DELETE FROM student_courses WHERE studentId = ?', [studentId]);

    // Now that associated records are deleted, delete the student from the students table
    const [deletedStudent] = await connection.execute(
      'DELETE FROM students WHERE studentId = ?',
      [studentId]
    );

    await connection.commit();

    return deletedStudent.affectedRows > 0; // Return true if the student was successfully deleted
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    throw new Error('Failed to delete student');
  } finally {
    connection.release();
  }
};

// Function to update a student
const updateStudent = async (studentId, { studentName, email, age, courses }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Update student details in the students table
    await connection.execute(
      'UPDATE students SET studentName = ?, email = ?, age = ? WHERE studentId = ?',
      [studentName, email, age, studentId]
    );

    // Clear existing courses for the student in the student_courses table
    await connection.execute('DELETE FROM student_courses WHERE studentId = ?', [studentId]);

    // Insert updated courses for the student into the student_courses table
    for (const courseId of courses) {
      // Check if the courseId exists in the courses table
      const [course] = await connection.execute('SELECT * FROM courses WHERE courseId = ?', [courseId]);

      if (course.length > 0) {
        // If the course exists, insert into the student_courses table
        await connection.execute(
          'INSERT INTO student_courses (studentId, courseId) VALUES (?, ?)',
          [studentId, courseId]
        );
      } else {
        // If the course doesn't exist, you might want to handle this case based on your requirements
        console.error(`Course with courseId ${courseId} does not exist`);
      }
    }

    await connection.commit();

    // Fetch the updated student
    const [updatedStudent] = await connection.execute(
      'SELECT * FROM students WHERE studentId = ?',
      [studentId]
    );

    return updatedStudent[0]; // Return the updated student
  } catch (error) {
    await connection.rollback();
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
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
};