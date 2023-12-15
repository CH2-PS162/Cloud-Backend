const express = require('express');
const router = express.Router();
const CourseHandlers = require('../handlers/courseHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Define GET request handler for /courses/
router.get('/', checkAuthenticated, CourseHandlers.getAllCourses);

// Protected routes (require authentication and specific roles)
router.post('/', checkAuthenticated, CourseHandlers.createCourse); // Create course
router.delete('/:courseId', checkAuthenticated, CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', checkAuthenticated, CourseHandlers.updateCourse); // Update course


module.exports = router;
