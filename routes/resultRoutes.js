const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const ResultHandlers = require('../handlers/resultHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorizeRoles(['admin', 'teacher', 'student', 'parent']), ResultHandlers.getAllResults);
router.post('/', authenticateToken, authorizeRoles(['admin', 'teacher']), ResultHandlers.addResult);
router.delete('/:resultId', authenticateToken, authorizeRoles(['admin']), ResultHandlers.deleteResult);
router.put('/:resultId', authenticateToken, authorizeRoles(['admin', 'teacher']), ResultHandlers.updateResult);

module.exports = router;