const express = require('express');
const router = express.Router();
const ResultHandlers = require('../handlers/resultHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Protected routes (require authentication and specific roles)
router.get('/', checkAuthenticated, ResultHandlers.getAllResults);
router.post('/', checkAuthenticated, ResultHandlers.addResult);
router.delete('/:resultId', checkAuthenticated, ResultHandlers.deleteResult);
router.put('/:resultId', checkAuthenticated, ResultHandlers.updateResult);


module.exports = router;