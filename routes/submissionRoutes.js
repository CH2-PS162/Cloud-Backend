const express = require('express');
const router = express.Router();
const SubmissionHandlers = require('../handlers/submissionHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Protected routes (require authentication and specific roles)
router.get('/', checkAuthenticated, SubmissionHandlers.getAllSubmissions);
router.post('/', checkAuthenticated, SubmissionHandlers.addSubmission);
router.delete('/:submissionId', checkAuthenticated, SubmissionHandlers.deleteSubmission);
router.put('/:submissionId', checkAuthenticated, SubmissionHandlers.updateSubmission);


module.exports = router;
