// submissionHandlers.js

const Assignments = require('../models/assignments');
const Submissions = require('../models/submissions');

const getAllSubmissions = async (req, res) => {
  try {
    const allSubmissions = await Submissions.getAllSubmissions(); // Add await here
    if (!allSubmissions || allSubmissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found' });
    }
    return res.status(200).json(allSubmissions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addSubmission = async (req, res) => {
  try {
    const { studentId, assignmentId, courseId, submissionText } = req.body;

    // Use isAssignmentOverdue from Assignments module to check if the assignment is overdue
    const assignmentOverdue = await Assignments.isAssignmentOverdue(assignmentId);

    const submissionDate = new Date().toISOString();
    const isLateSubmission = assignmentOverdue && new Date(submissionDate) > new Date();

    const newSubmission = await Submissions.addSubmission({
      studentId,
      assignmentId,
      courseId,
      submissionText,
      isLate: isLateSubmission,
    });

    return res.status(201).json(newSubmission);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const deleteSubmission = (req, res) => {
  try {
    const { submissionId } = req.params;
    const isDeleted = Submissions.deleteSubmission(submissionId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Submission deleted successfully' });
    }
    return res.status(404).json({ message: 'Submission not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { studentId, assignmentId, courseId, submissionText } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Invalid request. courseId is required.' });
    }

    const updatedSubmission = await Submissions.updateSubmission(submissionId, { studentId, assignmentId, courseId, submissionText });
    
    if (updatedSubmission) {
      return res.status(200).json(updatedSubmission);
    }

    return res.status(404).json({ message: 'Submission not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllSubmissions,
  addSubmission,
  deleteSubmission,
  updateSubmission,
};
