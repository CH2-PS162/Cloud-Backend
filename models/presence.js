// presence.js (in models directory)

let presenceRecords = [];

const markPresence = ({ studentId, courseId, date }) => {
  const newPresenceRecord = {
    studentId,
    courseId,
    date: date || new Date().toISOString(), // Assuming current date if date is not provided
  };

  presenceRecords.push(newPresenceRecord);
  return newPresenceRecord;
};

const getPresenceByDate = (date) => {
  return presenceRecords.filter((record) => record.date === date);
};

module.exports = {
  markPresence,
  getPresenceByDate,
};
