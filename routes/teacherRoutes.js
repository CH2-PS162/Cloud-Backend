const express = require('express');
const router = express.Router();
const TeacherHandlers = require('../handlers/teacherHandlers');
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

router.get('/', TeacherHandlers.getAllTeachers);
router.get('/courses', authenticateToken, TeacherHandlers.getCoursesForTeacher);
router.post('/', authenticateToken, TeacherHandlers.addTeacher);
router.delete('/:teacherId', authenticateToken, TeacherHandlers.deleteTeacher);
router.put('/:teacherId', authenticateToken, TeacherHandlers.updateTeacher);

module.exports = router;