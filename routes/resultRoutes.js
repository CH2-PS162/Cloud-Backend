const express = require('express');
const router = express.Router();
const ResultHandlers = require('../handlers/resultHandlers');
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

router.get('/', authenticateToken, ResultHandlers.getAllResults);
router.post('/', authenticateToken, ResultHandlers.addResult);
router.delete('/:resultId', authenticateToken, ResultHandlers.deleteResult);
router.put('/:resultId', authenticateToken, ResultHandlers.updateResult);


module.exports = router;