const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const SubmissionHandlers = require('../handlers/submissionHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorizeRoles(['admin', 'teacher', 'student', 'parent']), SubmissionHandlers.getAllSubmissions);
router.post('/', authenticateToken, authorizeRoles(['admin', 'student']), SubmissionHandlers.addSubmission);
router.delete('/:submissionId', authenticateToken, authorizeRoles(['admin', 'student']), SubmissionHandlers.deleteSubmission);
router.put('/:submissionId', authenticateToken, authorizeRoles(['admin', 'student']), SubmissionHandlers.updateSubmission);

module.exports = router;
