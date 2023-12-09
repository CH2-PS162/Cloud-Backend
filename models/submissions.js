// submissions.js (in models directory)

const db = require('../database/db');
const { isAssignmentOverdue } = require('./assignments');
const { nanoid } = require('nanoid');

// Function to generate a submission ID
const generateSubmissionID = () => {
  return nanoid(8);
};

const getAllSubmissions = async () => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM submissions');
    return rows;
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    throw new Error('Failed to retrieve submissions');
  } finally {
    connection.release();
  }
};

const addSubmission = async ({ studentId, assignmentId, courseId, submissionText, dueDate }) => {
  const submissionDate = new Date().toISOString();
  const isLateSubmission = await isAssignmentOverdue(assignmentId);

  const connection = await db.getConnection();
  try {
    // Insert the new submission into the submissions table
    const submissionId = generateSubmissionID();
    const [result] = await connection.execute(
      'INSERT INTO submissions (submissionId, studentId, assignmentId, courseId, submissionText, submissionDate, isLate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [submissionId, studentId, assignmentId, courseId, submissionText, submissionDate, isLateSubmission ? 1 : 0]
    );

    if (result.affectedRows > 0) {
      return {
        submissionId: result.insertId,
        studentId,
        assignmentId,
        courseId,
        submissionText,
        submissionDate,
        isLate: isLateSubmission,
      };
    }

    throw new Error('Failed to add submission');
  } catch (error) {
    console.error('Error adding submission:', error);
    throw new Error('Failed to add submission');
  } finally {
    connection.release();
  }
};

const deleteSubmission = async (submissionId) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute('DELETE FROM submissions WHERE submissionId = ?', [submissionId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw new Error('Failed to delete submission');
  } finally {
    connection.release();
  }
};

const updateSubmission = async (submissionId, { studentId, assignmentId, courseId, submissionText }) => {
  const connection = await db.getConnection();
  try {
    // Use isAssignmentOverdue from Assignments module to check if the assignment is overdue
    const isLateSubmission = await isAssignmentOverdue(assignmentId);

    const [result] = await connection.execute(
      'UPDATE submissions SET studentId = ?, assignmentId = ?, courseId = ?, submissionText = ?, submissionDate = ?, isLate = ? WHERE submissionId = ?',
      [studentId, assignmentId, courseId, submissionText, new Date().toISOString(), isLateSubmission ? 1 : 0, submissionId]
    );

    if (result.affectedRows > 0) {
      return {
        submissionId,
        studentId,
        assignmentId,
        courseId,
        submissionText,
      };
    }

    return null;
  } catch (error) {
    console.error('Error updating submission:', error);
    throw new Error('Failed to update submission');
  } finally {
    connection.release();
  }
};

module.exports = {
  generateSubmissionID,
  getAllSubmissions,
  addSubmission,
  deleteSubmission,
  updateSubmission,
};