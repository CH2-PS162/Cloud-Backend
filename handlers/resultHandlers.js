// resultHandlers.js

const Results = require('../models/results');

const getAllResults = async (req, res) => {
  try {
    const allResults = await Results.getAllResults();
    if (!allResults) {
      return res.status(404).json({ message: 'No results found' });
    }
    return res.status(200).json(allResults);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addResult = async (req, res) => {
  try {
    const { studentId, courseId, assignmentId, score } = req.body;
    const newResult = await Results.addResult({ studentId, courseId, assignmentId, score });
    return res.status(201).json(newResult);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const isDeleted = await Results.deleteResult(resultId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Result deleted successfully' });
    }
    return res.status(404).json({ message: 'Result not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { studentId, courseId, assignmentId, score } = req.body;
    const updatedResult = await Results.updateResult(resultId, { studentId, courseId, assignmentId, score });
    if (updatedResult) {
      return res.status(200).json(updatedResult);
    }
    return res.status(404).json({ message: 'Result not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllResults,
  addResult,
  deleteResult,
  updateResult,
};
