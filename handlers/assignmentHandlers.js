// assignmentHandlers.js

const Assignments = require('../models/assignments');

const getAllAssignments = (req, res) => {
  try {
    const allAssignments = Assignments.getAllAssignments();
    if (!allAssignments) {
      return res.status(404).json({ message: 'No assignments found' });
    }
    return res.status(200).json(allAssignments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addAssignment = (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const newAssignment = Assignments.addAssignment({ title, description, dueDate, courseId });
    return res.status(201).json(newAssignment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAssignment = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const isDeleted = Assignments.deleteAssignment(assignmentId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Assignment deleted successfully' });
    }
    return res.status(404).json({ message: 'Assignment not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateAssignment = (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate, courseId } = req.body;
    const updatedAssignment = Assignments.updateAssignment(assignmentId, { title, description, dueDate, courseId });
    if (updatedAssignment) {
      return res.status(200).json(updatedAssignment);
    }
    return res.status(404).json({ message: 'Assignment not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
};
