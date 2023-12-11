const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const TeacherHandlers = require('../handlers/teacherHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorize(['admin', 'teacher', 'parent']), TeacherHandlers.getAllTeachers);
router.post('/', authenticateToken, authorize(['admin']), TeacherHandlers.addTeacher);
router.delete('/:teacherId', authenticateToken, authorize(['admin']), TeacherHandlers.deleteTeacher);
router.put('/:teacherId', authenticateToken, authorize(['admin', 'teacher']), TeacherHandlers.updateTeacher);

module.exports = router;