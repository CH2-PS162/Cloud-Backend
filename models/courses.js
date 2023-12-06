let nanoid;

(async () => {
    const nanoidModule = await import('nanoid');
    nanoid = nanoidModule.nanoid;
  })();


// Function to generate a unique course ID
const generateCourseID = () => {
    return nanoid(10); // Generating a unique 10-character ID using nanoid
  };

  let courses = [];

// Function to get all courses
const getAllCourses = () => {
    if (!courses || !Array.isArray(courses)) {
        throw new Error('Course data is invalid or unavailable');
      }
    
      // Check for empty course data
      if (courses.length === 0) {
        return null;
      }
    
      return courses; // Return courses if available
    };

const createCourse = ({ courseName, instructorId, schedule, description }) => {
  const newCourse = {
    courseId: generateCourseID(), // Assuming you have a function to generate unique IDs
    courseName,
    instructorId,
    schedule,
    description,
  };

  courses.push(newCourse);
  return newCourse;
};

const deleteCourse = (courseId) => {
  const initialLength = courses.length;
  courses = courses.filter((course) => course.courseId !== courseId);
  return courses.length !== initialLength;
};

const updateCourse = (courseId, { courseName, instructorId, schedule, description }) => {
  const index = courses.findIndex((course) => course.courseId === courseId);

  if (index !== -1) {
    courses[index] = {
      ...courses[index],
      courseName,
      instructorId,
      schedule,
      description,
    };
    return courses[index];
  }
  return null;
};

module.exports = {
  generateCourseID,
  getAllCourses,
  createCourse,
  deleteCourse,
  updateCourse,
};
