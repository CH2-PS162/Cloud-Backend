const Teachers = require('../models/teachers');

const getAllTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const allTeachers = await Teachers.getAllTeachers(page, pageSize);

    if (!allTeachers || allTeachers.length === 0) {
      return res.status(404).json({ message: 'No teachers found' });
    }

    return res.status(200).json(allTeachers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const { name, dob, address, sex, maritalStatus, yearsofWork, courses, description } = req.body;
    const newTeacher = await Teachers.addTeacher({ name, dob, address, sex, maritalStatus, yearsofWork, courses, description });
    return res.status(201).json(newTeacher);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const isDeleted = await Teachers.deleteTeacher(teacherId);
    if (isDeleted) {
      return res.status(200).json({ message: 'Teacher deleted successfully' });
    }
    return res.status(404).json({ message: 'Teacher not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { name, dob, address, sex, maritalStatus, yearsofWork, courses, description } = req.body;
    const updatedTeacher = await Teachers.updateTeacher(teacherId, { name, dob, address, sex, maritalStatus, yearsofWork, courses, description });
    if (updatedTeacher) {
      return res.status(200).json(updatedTeacher);
    }
    return res.status(404).json({ message: 'Teacher not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCoursesForTeacher = async (req, res) => {
  try {
    console.log('Request User:', req.user); 
    const teacherId = req.user.id;

    if (!teacherId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is missing or undefined in the request',
      });
    }

    const teacherCourses = await Teachers.getCoursesForTeacher(teacherId);

    if (!teacherCourses || teacherCourses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No courses found for the logged-in teacher',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        courses: teacherCourses,
      },
    });
  } catch (error) {
    console.error('Error retrieving courses for the teacher:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve courses. An internal server error occurred.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTeachers,
  addTeacher,
  deleteTeacher,
  updateTeacher,
  getCoursesForTeacher
};
