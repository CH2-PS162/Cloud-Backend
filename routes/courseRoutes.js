const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const CourseHandlers = require('../handlers/courseHandlers');

// Define GET request handler for /courses/
router.get('/', authenticateToken, CourseHandlers.getAllCourses);

// Protected routes (require authentication and specific roles)
router.post('/', authenticateToken, authorizeRoles(['admin']), CourseHandlers.createCourse); // Create course
router.delete('/:courseId', authenticateToken, authorizeRoles(['admin']), CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', authenticateToken, authorizeRoles(['admin', 'teacher']), CourseHandlers.updateCourse); // Update course

module.exports = router;
