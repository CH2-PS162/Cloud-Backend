const express = require('express');
const router = express.Router();
const PresenceHandlers = require('../handlers/presenceHandlers');
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

// Protected routes (require authentication and specific roles)
router.post('/mark', authenticateToken, PresenceHandlers.markPresence);
router.get('/date/:date', authenticateToken, PresenceHandlers.getPresenceByDate);


module.exports = router;
