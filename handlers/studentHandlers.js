// studentHandlers.js

const Students = require('../models/students');

const getAllStudents = (req, res) => {
  try {
    const allStudents = Students.getAllStudents();
    if (!allStudents) {
      return res.status(404).json({ message: 'No students found' });
    }
    return res.status(200).json(allStudents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addStudent = (req, res) => {
  try {
    const { studentName, email, age, courses } = req.body;
    const newStudent = Students.addStudent({ studentName, email, age, courses });
    return res.status(201).json(newStudent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteStudent = (req, res) => {
  try {
    const { studentId } = req.params;
    const isDeleted = Students.deleteStudent(studentId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Student deleted successfully' });
    }
    return res.status(404).json({ message: 'Student not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateStudent = (req, res) => {
  try {
    const { studentId } = req.params;
    const { studentName, email, age, courses } = req.body;
    const updatedStudent = Students.updateStudent(studentId, { studentName, email, age, courses });
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
