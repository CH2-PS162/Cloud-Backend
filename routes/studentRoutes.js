const express = require('express');
const router = express.Router();
const StudentHandlers = require('../handlers/studentHandlers');
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

router.get('/my-courses', authenticateToken, StudentHandlers.getCoursesForStudent);
router.get('/', authenticateToken, StudentHandlers.getAllStudents);
router.post('/', StudentHandlers.addStudent);
router.delete('/:studentId', authenticateToken, StudentHandlers.deleteStudent);
router.put('/:studentId', authenticateToken, StudentHandlers.updateStudent);

module.exports = router;
