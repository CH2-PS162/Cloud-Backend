const express = require('express');
const router = express.Router();
const CourseHandlers = require('../handlers/courseHandlers');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Missing token',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error('Error decoding token:', err);
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: Invalid token',
      });
    }

    console.log('Decoded token:', user);
    req.user = { id: user.user_id, email: user.email };
    next();
  });
}

// Define GET request handler for /courses/
router.get('/', authenticateToken, CourseHandlers.getAllCourses);
// Protected routes (require authentication and specific roles)
router.post('/', CourseHandlers.createCourse); // Create course
router.delete('/:courseId', authenticateToken, CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', authenticateToken, CourseHandlers.updateCourse); // Update course


module.exports = router;
