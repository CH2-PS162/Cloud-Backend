const express = require('express');
const router = express.Router();
const SubmissionHandlers = require('../handlers/submissionHandlers');
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

router.get('/', authenticateToken, SubmissionHandlers.getAllSubmissions);
router.post('/', authenticateToken, SubmissionHandlers.addSubmission);
router.delete('/:submissionId', authenticateToken, SubmissionHandlers.deleteSubmission);
router.put('/:submissionId', authenticateToken, SubmissionHandlers.updateSubmission);


module.exports = router;
