const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const PresenceHandlers = require('../handlers/presenceHandlers');

// Protected routes (require authentication and specific roles)
router.post('/mark', authenticateToken, authorizeRoles(['admin', 'teacher', 'student']), PresenceHandlers.markPresence);
router.get('/date/:date', authenticateToken, authorizeRoles(['admin', 'teacher', 'student', 'parent']), PresenceHandlers.getPresenceByDate);

module.exports = router;
