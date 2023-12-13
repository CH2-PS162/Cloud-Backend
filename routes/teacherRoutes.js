const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const TeacherHandlers = require('../handlers/teacherHandlers');

// Protected routes (require authentication and specific roles)
router.get('/', authenticateToken, authorizeRoles(['admin', 'teacher', 'parent']), TeacherHandlers.getAllTeachers);
router.post('/', authenticateToken, authorizeRoles(['admin']), TeacherHandlers.addTeacher);
router.delete('/:teacherId', authenticateToken, authorizeRoles(['admin']), TeacherHandlers.deleteTeacher);
router.put('/:teacherId', authenticateToken, authorizeRoles(['admin', 'teacher']), TeacherHandlers.updateTeacher);

module.exports = router;