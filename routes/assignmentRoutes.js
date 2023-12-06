const express = require('express');
const router = express.Router();
const AssignmentHandlers = require('../handlers/assignmentHandlers');

router.get('/', AssignmentHandlers.getAllAssignments); // Get all assignments
router.post('/', AssignmentHandlers.createAssignment); // Create an assignment
router.get('/:assignmentId', AssignmentHandlers.getAssignmentById); // Get assignment by ID
router.put('/:assignmentId', AssignmentHandlers.updateAssignment); // Update assignment by ID
router.delete('/:assignmentId', AssignmentHandlers.deleteAssignment); // Delete assignment by ID

module.exports = router;
