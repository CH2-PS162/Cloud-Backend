const express = require('express');
const router = express.Router();
const TeacherHandlers = require('../handlers/teacherHandlers');
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
// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, TeacherHandlers.getAllTeachers);
router.post('/', authenticateToken, TeacherHandlers.addTeacher);
router.delete('/:teacherId', authenticateToken, TeacherHandlers.deleteTeacher);
router.put('/:teacherId', authenticateToken, TeacherHandlers.updateTeacher);

module.exports = router;