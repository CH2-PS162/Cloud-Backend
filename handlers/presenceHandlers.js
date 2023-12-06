// presenceHandlers.js

const Presence = require('../models/presence');

const markPresence = (req, res) => {
  try {
    const { studentId, courseId, date } = req.body;
    const presenceRecord = Presence.markPresence({ studentId, courseId, date });
    return res.status(201).json(presenceRecord);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPresenceByDate = (req, res) => {
  try {
    const { date } = req.params;
    const presenceRecords = Presence.getPresenceByDate(date);
    return res.status(200).json(presenceRecords);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markPresence,
  getPresenceByDate,
};
