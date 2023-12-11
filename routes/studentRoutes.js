const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const StudentHandlers = require('../handlers/studentHandlers');

router.get('/', authenticateToken, authorize(['student', 'admin', 'parent']), StudentHandlers.getAllStudents);
router.post('/', authenticateToken, authorize(['admin']), StudentHandlers.addStudent);
router.delete('/:studentId', authenticateToken, authorize(['admin']), StudentHandlers.deleteStudent);
router.put('/:studentId', authenticateToken, authorize(['admin', 'parent']), StudentHandlers.updateStudent);

module.exports = router;
