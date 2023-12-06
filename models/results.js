// results.js (in models directory)

let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();

let results = [];

const generateResultID = () => {
  return nanoid(8); // Generating a unique 8-character ID using nanoid
};

const getAllResults = () => {
  if (!results || !Array.isArray(results)) {
    throw new Error('Result data is invalid or unavailable');
  }

  if (results.length === 0) {
    return null;
  }

  return results;
};

const addResult = ({ studentId, courseId, assignmentId, score }) => {
  const newResult = {
    resultId: generateResultID(),
    studentId,
    courseId,
    assignmentId,
    score,
  };

  results.push(newResult);
  return newResult;
};

const deleteResult = (resultId) => {
  const initialLength = results.length;
  results = results.filter((result) => result.resultId !== resultId);
  return results.length !== initialLength;
};

const updateResult = (resultId, { studentId, courseId, assignmentId, score }) => {
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
  return null;
};

module.exports = {
  generateResultID,
  getAllResults,
  addResult,
  deleteResult,
  updateResult,
};
