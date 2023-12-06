const express = require('express');
const router = express.Router();
const TeacherHandlers = require('../handlers/teacherHandlers');

router.get('/', TeacherHandlers.getAllTeachers);
router.post('/', TeacherHandlers.addTeacher);
router.delete('/:teacherId', TeacherHandlers.deleteTeacher);
router.put('/:teacherId', TeacherHandlers.updateTeacher);

module.exports = router;
