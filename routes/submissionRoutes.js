const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const SubmissionHandlers = require('../handlers/submissionHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorize(['admin', 'teacher', 'student', 'parent']), SubmissionHandlers.getAllSubmissions);
router.post('/', authenticateToken, authorize(['admin', 'student']), SubmissionHandlers.addSubmission);
router.delete('/:submissionId', authenticateToken, authorize(['admin', 'student']), SubmissionHandlers.deleteSubmission);
router.put('/:submissionId', authenticateToken, authorize(['admin', 'student']), SubmissionHandlers.updateSubmission);

module.exports = router;
