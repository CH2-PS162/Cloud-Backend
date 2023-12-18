const Assignments = require('../models/assignments.js');

const getAllAssignments = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;

    const assignments = await Assignments.getAssignmentsByStudentId(studentId, page, pageSize);

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for the student' });
    }

    return res.status(200).json(assignments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const newAssignment = await Assignments.addAssignment({ title, description, dueDate, courseId });
    return res.status(201).json(newAssignment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const isDeleted = await Assignments.deleteAssignment(assignmentId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Assignment deleted successfully' });
    }
    return res.status(404).json({ message: 'Assignment not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate, courseId } = req.body;
    const updatedAssignment = await Assignments.updateAssignment(assignmentId, { title, description, dueDate, courseId });
    if (updatedAssignment) {
      return res.status(200).json(updatedAssignment);
    }
    return res.status(404).json({ message: 'Assignment not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkAssignmentOverdue = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const overdue = await Assignments.isAssignmentOverdue(assignmentId);
    return res.status(200).json({ overdue });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check if assignment is overdue' });
  }
};

module.exports = {
  getAllAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  checkAssignmentOverdue,
};