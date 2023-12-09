// assignmentRoutes.js

const express = require('express');
const router = express.Router();
const AssignmentHandlers = require('../handlers/assignmentHandlers');

router.get('/', AssignmentHandlers.getAllAssignments);
router.post('/', AssignmentHandlers.addAssignment);
router.delete('/:assignmentId', AssignmentHandlers.deleteAssignment);
router.put('/:assignmentId', AssignmentHandlers.updateAssignment);
router.get('/:assignmentId/overdue', AssignmentHandlers.checkAssignmentOverdue); // New route for checking if an assignment is overdue

module.exports = router;
