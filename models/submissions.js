// submissions.js (in models directory)

let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();

let submissions = [];

const generateSubmissionID = () => {
  return nanoid(8); // Generating a unique 8-character ID using nanoid
};

const getAllSubmissions = () => {
  if (!submissions || !Array.isArray(submissions)) {
    throw new Error('Submission data is invalid or unavailable');
  }

  if (submissions.length === 0) {
    return null;
  }

  return submissions;
};

const addSubmission = ({ studentId, assignmentId, submissionText }) => {
    const assignmentOverdue = Assignments.isAssignmentOverdue(assignmentId);
    const submissionDate = new Date().toISOString();
    const isLateSubmission = assignmentOverdue && submissionDate > new Date(Assignments.getAssignmentDeadline(assignmentId)).toISOString();
  
    const newSubmission = {
      submissionId: generateSubmissionID(),
      studentId,
      assignmentId,
      submissionText,
      submissionDate,
      isLate: isLateSubmission,
    };
  
    submissions.push(newSubmission);
    return newSubmission;
  };

const deleteSubmission = (submissionId) => {
  const initialLength = submissions.length;
  submissions = submissions.filter((submission) => submission.submissionId !== submissionId);
  return submissions.length !== initialLength;
};

const updateSubmission = (submissionId, { studentId, assignmentId, submissionText }) => {
  const index = submissions.findIndex((submission) => submission.submissionId === submissionId);

  if (index !== -1) {
    submissions[index] = {
      ...submissions[index],
      studentId,
      assignmentId,
      submissionText,
    };
    return submissions[index];
  }
  return null;
};

module.exports = {
  generateSubmissionID,
  getAllSubmissions,
  addSubmission,
  deleteSubmission,
  updateSubmission,
};
