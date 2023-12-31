const express = require('express');
const router = express.Router();
const AssignmentHandlers = require('../handlers/assignmentHandlers');
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

router.get('/', authenticateToken, AssignmentHandlers.getAllAssignments);
router.post('/', authenticateToken, AssignmentHandlers.addAssignment);
router.delete('/:assignmentId', authenticateToken, AssignmentHandlers.deleteAssignment);
router.put('/:assignmentId', authenticateToken, AssignmentHandlers.updateAssignment);
router.get('/:assignmentId/overdue', authenticateToken, AssignmentHandlers.checkAssignmentOverdue);

module.exports = router;
