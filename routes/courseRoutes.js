const express = require('express');
const router = express.Router();
const CourseHandlers = require('../handlers/courseHandlers');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Define GET request handler for /courses/
router.get('/', authenticateToken, CourseHandlers.getAllCourses);

// Protected routes (require authentication and specific roles)
router.post('/', authenticateToken, CourseHandlers.createCourse); // Create course
router.delete('/:courseId', authenticateToken, CourseHandlers.deleteCourse); // Delete course
router.put('/:courseId', authenticateToken, CourseHandlers.updateCourse); // Update course


module.exports = router;
