const express = require('express');
const router = express.Router();
const StudentHandlers = require('../handlers/studentHandlers');

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/')
  }

router.get('/', checkAuthenticated, StudentHandlers.getAllStudents);
router.post('/', checkAuthenticated, StudentHandlers.addStudent);
router.delete('/:studentId', checkAuthenticated, StudentHandlers.deleteStudent);
router.put('/:studentId', checkAuthenticated, StudentHandlers.updateStudent);


module.exports = router;
