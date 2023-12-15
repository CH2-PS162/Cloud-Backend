const express = require('express');
const router = express.Router();
const StudentHandlers = require('../handlers/studentHandlers');
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
router.get('/', authenticateToken, StudentHandlers.getAllStudents);
router.post('/', authenticateToken, StudentHandlers.addStudent);
router.delete('/:studentId', authenticateToken, StudentHandlers.deleteStudent);
router.put('/:studentId', authenticateToken, StudentHandlers.updateStudent);


module.exports = router;
