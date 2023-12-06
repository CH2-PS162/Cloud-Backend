const AssignmentsModel = require('../models/assignments');

const getAllAssignments = (req, res) => {
  try {
    const allAssignments = AssignmentsModel.getAllAssignments();

    if (!allAssignments || allAssignments.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No assignments found or assignment database is empty',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        assignments: allAssignments,
      },
    });
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve assignments. An internal server error occurred.',
    });
  }
};

const createAssignment = (req, res) => {
  try {
    const { courseId, title, description, deadline, createdBy } = req.body;

    if (!courseId || !title || !description || !deadline || !createdBy) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all necessary assignment details',
      });
    }

    // Assuming authentication is handled to get the createdBy user info
    // Check if the user has permission to create an assignment for the course

    const newAssignment = AssignmentsModel.createAssignment({
      courseId,
      title,
      description,
      deadline,
      createdBy,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Assignment created successfully',
      data: {
        assignment: newAssignment,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create assignment',
    });
  }
};

// Other handlers: getAssignmentById, updateAssignment, deleteAssignment

module.exports = {
  getAllAssignments,
  createAssignment,
  // Include other assignment handlers
};
