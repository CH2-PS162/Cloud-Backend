const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const CourseHandlers = require('../handlers/courseHandlers');

// Define GET request handler for /courses/
router.get('/', authenticateToken, authorize(['admin', 'teacher', 'student', 'parent']), CourseHandlers.getAllCourses);

// Protected routes (require authentication and specific roles)
router.post('/', authenticateToken, authorize(['admin']), CourseHandlers.createCourse); // Create course
router.delete('/:courseId', authenticateToken, authorize(['admin']), CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', authenticateToken, authorize(['admin', 'teacher']), CourseHandlers.updateCourse); // Update course

module.exports = router;
