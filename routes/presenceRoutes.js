const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const PresenceHandlers = require('../handlers/presenceHandlers');

// Protected routes (require authentication and specific roles)
router.post('/mark', authenticateToken, authorize(['admin', 'teacher', 'student']), PresenceHandlers.markPresence);
router.get('/date/:date', authenticateToken, authorize(['admin', 'teacher', 'student', 'parent']), PresenceHandlers.getPresenceByDate);

module.exports = router;
