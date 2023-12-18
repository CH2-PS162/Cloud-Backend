const Parents = require('../models/parents');
const db = require('../database/db');
const Presence = require('../models/presence');


const getAllParents = async (req, res) => {
  try {
    const allParents = await Parents.getAllParents();

    if (!allParents || allParents.length === 0) {
      return res.status(404).json({ message: 'No parents found' });
    }

    return res.status(200).json(allParents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addParent = async (req, res) => {
  try {
    const { parentName, email, studentId, studentName } = req.body;
    const newParent = await Parents.addParent({ parentName, email, studentId, studentName });
    return res.status(201).json(newParent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const isDeleted = await Parents.deleteParent(parentId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Parent deleted successfully' });
    }
    return res.status(404).json({ message: 'Parent not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { parentName, email, studentId, studentName } = req.body;
    const updatedParent = await Parents.updateParent(parentId, { parentName, email, studentId, studentName });
    if (updatedParent) {
      return res.status(200).json(updatedParent);
    }
    return res.status(404).json({ message: 'Parent not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCoursesForParent = async (req, res) => {
  try {
    const parentId = req.user.id;

    if (!parentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is missing or undefined in the request',
      });
    }

    const parentCourses = await Parents.getCoursesForParent(parentId);

    if (!parentCourses || parentCourses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No courses found for the logged-in parent',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        courses: parentCourses,
      },
    });
  } catch (error) {
    console.error('Error retrieving courses for the parent:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve courses. An internal server error occurred.',
      error: error.message, 
    });
  }
};

const getAllPresenceForParent = async (parentId) => {
    try {
      const connection = await db.getConnection();
  
      const [parentRows] = await connection.execute(
        'SELECT studentId FROM parents WHERE parentId = ?',
        [parentId]
      );
  
      if (parentRows.length === 0) {
        throw new Error('Parent not found');
      }
  
      const studentId = parentRows[0].studentId;
  
      // Pass the connection to the model function
      const presenceRecords = await Presence.getAllPresence(studentId, connection);
  
      return presenceRecords;
    } catch (error) {
      console.error('Error retrieving presence records for the parent:', error);
      throw new Error('Failed to retrieve presence records for the parent');
    }
  };

module.exports = {
  getAllParents,
  addParent,
  deleteParent,
  updateParent,
  getCoursesForParent,
  getAllPresenceForParent
};