const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const StudentHandlers = require('../handlers/studentHandlers');

router.get('/', authenticateToken, authorizeRoles(['student', 'admin', 'parent']), StudentHandlers.getAllStudents);
router.post('/', authenticateToken, authorizeRoles(['admin']), StudentHandlers.addStudent);
router.delete('/:studentId', authenticateToken, authorizeRoles(['admin']), StudentHandlers.deleteStudent);
router.put('/:studentId', authenticateToken, authorizeRoles(['admin', 'parent']), StudentHandlers.updateStudent);

module.exports = router;
