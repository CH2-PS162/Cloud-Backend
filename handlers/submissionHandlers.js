// submissionHandlers.js

const Submissions = require('../models/submissions');

const getAllSubmissions = (req, res) => {
  try {
    const allSubmissions = Submissions.getAllSubmissions();
    if (!allSubmissions) {
      return res.status(404).json({ message: 'No submissions found' });
    }
    return res.status(200).json(allSubmissions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addSubmission = (req, res) => {
  try {
    const { studentId, assignmentId, submissionText } = req.body;
    const newSubmission = Submissions.addSubmission({ studentId, assignmentId, submissionText });
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

const updateSubmission = (req, res) => {
  try {
    const { submissionId } = req.params;
    const { studentId, assignmentId, submissionText } = req.body;
    const updatedSubmission = Submissions.updateSubmission(submissionId, { studentId, assignmentId, submissionText });
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
