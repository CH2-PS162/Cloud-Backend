const express = require('express');
const router = express.Router();
const PresenceHandlers = require('../handlers/presenceHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Protected routes (require authentication and specific roles)
router.post('/mark', checkAuthenticated, PresenceHandlers.markPresence);
router.get('/date/:date', checkAuthenticated, PresenceHandlers.getPresenceByDate);


module.exports = router;
