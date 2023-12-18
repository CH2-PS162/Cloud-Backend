// studentHandlers.js
const Students = require('../models/students');

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const allStudents = await Students.getAllStudents(page, pageSize);

    if (!allStudents || allStudents.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    return res.status(200).json(allStudents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const { studentName, email, age, courses } = req.body;
    const newStudent = await Students.addStudent({ studentName, email, age, courses });
    return res.status(201).json(newStudent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const isDeleted = await Students.deleteStudent(studentId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Student deleted successfully' });
    }
    return res.status(404).json({ message: 'Student not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { studentName, email, age, courses } = req.body;
    const updatedStudent = await Students.updateStudent(studentId, { studentName, email, age, courses });
    if (updatedStudent) {
      return res.status(200).json(updatedStudent);
    }
    return res.status(404).json({ message: 'Student not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (!studentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is missing or undefined in the request',
      });
    }

    const studentCourses = await Students.getCoursesForStudent(studentId);

    if (!studentCourses || studentCourses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No courses found for the logged-in student',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        courses: studentCourses,
      },
    });
  } catch (error) {
    console.error('Error retrieving courses for the student:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve courses. An internal server error occurred.',
      error: error.message, 
    });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getCoursesForStudent,
};
