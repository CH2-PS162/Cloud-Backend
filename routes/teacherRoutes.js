const express = require('express');
const router = express.Router();
const TeacherHandlers = require('../handlers/teacherHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

// Protected routes (require authentication and specific roles)
router.get('/', checkAuthenticated, TeacherHandlers.getAllTeachers);
router.post('/', checkAuthenticated, TeacherHandlers.addTeacher);
router.delete('/:teacherId', checkAuthenticated, TeacherHandlers.deleteTeacher);
router.put('/:teacherId', checkAuthenticated, TeacherHandlers.updateTeacher);

module.exports = router;