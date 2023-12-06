// assignments.js (in models directory)

let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();


let assignments = [];

const generateAssignmentID = () => {
  return nanoid(8); // Generating a unique 8-character ID using nanoid
};

const getAllAssignments = () => {
  if (!assignments || !Array.isArray(assignments)) {
    throw new Error('Assignment data is invalid or unavailable');
  }

  if (assignments.length === 0) {
    return null;
  }

  return assignments;
};

const addAssignment = ({ title, description, dueDate, courseId }) => {
  const newAssignment = {
    assignmentId: generateAssignmentID(),
    title,
    description,
    dueDate,
    courseId,
  };

  assignments.push(newAssignment);
  return newAssignment;
};

const isAssignmentOverdue = (assignmentId) => {
    const assignment = assignments.find((assignment) => assignment.assignmentId === assignmentId);
    if (assignment) {
      const deadline = new Date(assignment.dueDate);
      const currentDate = new Date();
      return currentDate > deadline;
    }
    return false; // If assignment not found, it's not overdue
  };

const deleteAssignment = (assignmentId) => {
  const initialLength = assignments.length;
  assignments = assignments.filter((assignment) => assignment.assignmentId !== assignmentId);
  return assignments.length !== initialLength;
};

const updateAssignment = (assignmentId, { title, description, dueDate, courseId }) => {
  const index = assignments.findIndex((assignment) => assignment.assignmentId === assignmentId);

  if (index !== -1) {
    assignments[index] = {
      ...assignments[index],
      title,
      description,
      dueDate,
      courseId,
    };
    return assignments[index];
  }
  return null;
};

module.exports = {
  generateAssignmentID,
  getAllAssignments,
  addAssignment,
  isAssignmentOverdue,
  deleteAssignment,
  updateAssignment,
};
