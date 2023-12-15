// results.js (in models directory)

const db = require('../database/db');
const { nanoid } = require('nanoid');

let results = [];

// Function to generate a result ID
const generateResultID = () => {
  return nanoid(8);
};

const getAllResults = async (page = 1, pageSize = 8) => {
  const connection = await db.getConnection();
  try {
    const offset = (page - 1) * pageSize;
    const [rows] = await connection.execute(
      'SELECT * FROM results LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    return rows;
  } catch (error) {
    console.error('Error retrieving results:', error);
    throw new Error('Failed to retrieve results');
  } finally {
    connection.release();
  }
};


const addResult = async ({ studentId, courseId, assignmentId, score }) => {
  const connection = await db.getConnection();
  try {
    const resultId = generateResultID();
    const [result] = await connection.execute(
      'INSERT INTO results (resultId, studentId, courseId, assignmentId, score) VALUES (?, ?, ?, ?, ?)',
      [resultId, studentId, courseId, assignmentId, score]
    );

    if (result.affectedRows > 0) {
      const newResult = {
        resultId,
        studentId,
        courseId,
        assignmentId,
        score,
      };
      results.push(newResult);
      return newResult;
    }

    throw new Error('Failed to add result');
  } catch (error) {
    console.error('Error adding result:', error);
    throw new Error('Failed to add result');
  } finally {
    connection.release();
  }
};

const deleteResult = async (resultId) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute('DELETE FROM results WHERE resultId = ?', [resultId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting result:', error);
    throw new Error('Failed to delete result');
  } finally {
    connection.release();
  }
};

const updateResult = async (resultId, { studentId, courseId, assignmentId, score }) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'UPDATE results SET studentId = ?, courseId = ?, assignmentId = ?, score = ? WHERE resultId = ?',
      [studentId, courseId, assignmentId, score, resultId]
    );

    if (result.affectedRows > 0) {
      const index = results.findIndex((result) => result.resultId === resultId);
      if (index !== -1) {
        results[index] = {
          ...results[index],
          studentId,
          courseId,
          assignmentId,
          score,
        };
        return results[index];
      }
    }

    return null;
  } catch (error) {
    console.error('Error updating result:', error);
    throw new Error('Failed to update result');
  } finally {
    connection.release();
  }
};

module.exports = {
  generateResultID,
  getAllResults,
  addResult,
  deleteResult,
  updateResult,
};
