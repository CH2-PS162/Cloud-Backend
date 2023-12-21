
const Presence = require('../models/presence');

const markPresence = async (req, res) => {
  try {
    const { studentId } = req.user || {};

    if (studentId !== undefined) {
      const currentDate = new Date().toISOString().split('T')[0];

      const courseId = req.body.courseId || 'defaultCourseId';

      const presenceRecord = await Presence.markPresenceInDatabase({
        studentId,
        courseId,
        date: currentDate,
      });

      if (presenceRecord) {
        return res.status(201).json({ message: 'Student marked as present', data: presenceRecord });
      } else {
        return res.status(404).json({ message: 'Unable to mark presence' });
      }
    } else {
      throw new Error('studentId is undefined');
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllPresence = async (req, res) => {
  try {
    const { studentId } = req.user;

    console.log('Student ID:', studentId);

    const presenceRecords = await Presence.getAllPresence(studentId);

    console.log('Presence records:', presenceRecords);

    return res.status(200).json({ presenceRecords });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};


const getPresenceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { studentId } = req.user; 

    console.log('User:', req.user);
    console.log('Request parameters:', { studentId, date });

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const presenceRecords = await Presence.getPresenceByDate(studentId, date);

    console.log('Presence records:', presenceRecords);
    return res.status(200).json(presenceRecords);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markPresence,
  getAllPresence,
  getPresenceByDate,
};

