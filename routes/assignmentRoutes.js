const express = require('express');
const router = express.Router();
const AssignmentHandlers = require('../handlers/assignmentHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Assignments routes with authentication and authorization
router.get('/', checkAuthenticated , AssignmentHandlers.getAllAssignments);
router.post('/', checkAuthenticated, AssignmentHandlers.addAssignment);
router.delete('/:assignmentId', checkAuthenticated, AssignmentHandlers.deleteAssignment);
router.put('/:assignmentId', checkAuthenticated, AssignmentHandlers.updateAssignment);
router.get('/:assignmentId/overdue', checkAuthenticated, AssignmentHandlers.checkAssignmentOverdue);

module.exports = router;
