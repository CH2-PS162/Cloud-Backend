let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();

let students = [];

const generateStudentID = () => {
  return nanoid(8); // Generating a unique 8-character ID using nanoid
};

const getAllStudents = () => {
  if (!students || !Array.isArray(students)) {
    throw new Error('Student data is invalid or unavailable');
  }

  if (students.length === 0) {
    return null;
  }

  return students;
};

const addStudent = ({ studentName, email, age, courses = [] }) => {
  const newStudent = {
    studentId: generateStudentID(),
    studentName,
    email,
    age,
    courses,
  };

  students.push(newStudent);
  return newStudent;
};

const deleteStudent = (studentId) => {
  const initialLength = students.length;
  students = students.filter((student) => student.studentId !== studentId);
  return students.length !== initialLength;
};

const updateStudent = (studentId, { studentName, email, age, courses }) => {
  const index = students.findIndex((student) => student.studentId === studentId);

  if (index !== -1) {
    students[index] = {
      ...students[index],
      studentName,
      email,
      age,
      courses,
    };
    return students[index];
  }
  return null;
};

module.exports = {
  generateStudentID,
  getAllStudents,
  addStudent,
  deleteStudent,
  updateStudent,
};