const express = require('express');
const router = express.Router();
const CourseHandlers = require('../handlers/courseHandlers');

// Define GET request handler for /courses/
router.get('/', CourseHandlers.getAllCourses); // Handler to get all courses

router.post('/', CourseHandlers.createCourse); // Create course
router.delete('/:courseId', CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', CourseHandlers.updateCourse); // Update course

module.exports = router;