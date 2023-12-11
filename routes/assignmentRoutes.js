const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const AssignmentHandlers = require('../handlers/assignmentHandlers');

// Assignments routes with authentication and authorization
router.get('/', authenticateToken, authorize(['admin', 'teacher', 'student']), AssignmentHandlers.getAllAssignments);
router.post('/', authenticateToken, authorize(['admin', 'teacher']), AssignmentHandlers.addAssignment);
router.delete('/:assignmentId', authenticateToken, authorize(['admin', 'teacher']), AssignmentHandlers.deleteAssignment);
router.put('/:assignmentId', authenticateToken, authorize(['admin', 'teacher']), AssignmentHandlers.updateAssignment);
router.get('/:assignmentId/overdue', authenticateToken, authorize(['admin', 'teacher', 'student']), AssignmentHandlers.checkAssignmentOverdue);

module.exports = router;
