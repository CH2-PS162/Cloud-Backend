const { nanoid: generateAssignmentID } = require('nanoid');
const db = require('../database/db');

const getAllAssignments = async (page = 1, pageSize = 8) => {
  try {
    const connection = await db.getConnection();
    const offset = (page - 1) * pageSize;
    const [rows] = await connection.execute(
      'SELECT * FROM assignments LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    throw new Error('Failed to retrieve assignments');
  }
};


// Function to add an assignment
const addAssignment = async ({ title, description, dueDate, courseId }) => {
  try {
    const connection = await db.getConnection();
    const assignmentId = generateAssignmentID();

    await connection.execute(
      'INSERT INTO assignments (assignmentId, title, description, dueDate, courseId) VALUES (?, ?, ?, ?, ?)',
      [assignmentId, title, description, dueDate, courseId]
    );

    connection.release();
    return { assignmentId, title, description, dueDate, courseId };
  } catch (error) {
    console.error('Error adding assignment:', error);
    throw new Error('Failed to add assignment');
  }
};

// Function to check if an assignment is overdue
const isAssignmentOverdue = async (assignmentId) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [rows] = await connection.execute('SELECT dueDate FROM assignments WHERE assignmentId = ?', [assignmentId]);

    if (rows.length > 0) {
      const deadline = new Date(rows[0].dueDate);
      const currentDate = new Date();
      return currentDate > deadline;
    }

    return false;
  } catch (error) {
    console.error('Error checking if assignment is overdue:', error);
    throw new Error('Failed to check if assignment is overdue');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Function to delete an assignment
const deleteAssignment = async (assignmentId) => {
  let connection;
  try {
    connection = await db.getConnection();
    const [result] = await connection.execute('DELETE FROM assignments WHERE assignmentId = ?', [assignmentId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw new Error('Failed to delete assignment');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Function to update an assignment
const updateAssignment = async (assignmentId, { title, description, dueDate, courseId }) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.execute(
      'UPDATE assignments SET title = ?, description = ?, dueDate = ?, courseId = ? WHERE assignmentId = ?',
      [title, description, dueDate, courseId, assignmentId]
    );

    return { assignmentId, title, description, dueDate, courseId };
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw new Error('Failed to update assignment');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const getAssignmentsByStudentId = async (studentId, page = 1, pageSize = 8) => {
  try {
    const connection = await db.getConnection();
    const offset = (page - 1) * pageSize;
    
    // Fetch assignments based on the studentId
    const [rows] = await connection.execute(
      'SELECT a.* FROM assignments a ' +
      'JOIN courses c ON a.courseId = c.courseId ' +
      'JOIN student_courses sc ON c.courseId = sc.courseId ' +
      'WHERE sc.studentId = ? ' +
      'LIMIT ? OFFSET ?',
      [studentId, pageSize, offset]
    );

    connection.release();
    return rows;
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    throw new Error('Failed to retrieve assignments');
  }
};

module.exports = {
  generateAssignmentID,
  getAllAssignments,
  addAssignment,
  isAssignmentOverdue: isAssignmentOverdue,
  deleteAssignment,
  updateAssignment,
  getAssignmentsByStudentId
};
