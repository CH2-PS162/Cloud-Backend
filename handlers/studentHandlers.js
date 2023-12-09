// studentHandlers.js

const Students = require('../models/students');

const getAllStudents = async (req, res) => {
  try {
    const allStudents = await Students.getAllStudents();
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

module.exports = {
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent,
};
