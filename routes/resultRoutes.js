const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const ResultHandlers = require('../handlers/resultHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorize(['admin', 'teacher', 'student', 'parent']), ResultHandlers.getAllResults);
router.post('/', authenticateToken, authorize(['admin', 'teacher']), ResultHandlers.addResult);
router.delete('/:resultId', authenticateToken, authorize(['admin']), ResultHandlers.deleteResult);
router.put('/:resultId', authenticateToken, authorize(['admin', 'teacher']), ResultHandlers.updateResult);

module.exports = router;