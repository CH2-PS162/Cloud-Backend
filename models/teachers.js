let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();

// teachers.js (in models directory)

let teachers = [];

const generateTeacherID = () => {
  return nanoid(8); // Generating a unique 8-character ID using nanoid
};

const getAllTeachers = () => {
  if (!teachers || !Array.isArray(teachers)) {
    throw new Error('Teacher data is invalid or unavailable');
  }

  if (teachers.length === 0) {
    return null;
  }

  return teachers;
};

const addTeacher = ({ name, dob, address, sex, maritalStatus, yearsOfWork, courses, description }) => {
  const newTeacher = {
    teacherId: generateTeacherID(),
    name,
    dob,
    address,
    sex,
    maritalStatus,
    yearsOfWork,
    courses,
    description,
  };

  teachers.push(newTeacher);
  return newTeacher;
};

const deleteTeacher = (teacherId) => {
  const initialLength = teachers.length;
  teachers = teachers.filter((teacher) => teacher.teacherId !== teacherId);
  return teachers.length !== initialLength;
};

const updateTeacher = (teacherId, { name, dob, address, sex, maritalStatus, yearsOfWork, courses, description }) => {
  const index = teachers.findIndex((teacher) => teacher.teacherId === teacherId);

  if (index !== -1) {
    teachers[index] = {
      ...teachers[index],
      name,
      dob,
      address,
      sex,
      maritalStatus,
      yearsOfWork,
      courses,
      description,
    };
    return teachers[index];
  }
  return null;
};

module.exports = {
  generateTeacherID,
  getAllTeachers,
  addTeacher,
  deleteTeacher,
  updateTeacher,
};
