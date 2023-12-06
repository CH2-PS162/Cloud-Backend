// submissionRoutes.js

const express = require('express');
const router = express.Router();
const SubmissionHandlers = require('../handlers/submissionHandlers');

router.get('/', SubmissionHandlers.getAllSubmissions);
router.post('/', SubmissionHandlers.addSubmission);
router.delete('/:submissionId', SubmissionHandlers.deleteSubmission);
router.put('/:submissionId', SubmissionHandlers.updateSubmission);

module.exports = router;
