const express = require('express');
const router = express.Router();
const StudentHandlers = require('../handlers/studentHandlers');

router.get('/', StudentHandlers.getAllStudents);
router.post('/', StudentHandlers.addStudent);
router.delete('/:studentId', StudentHandlers.deleteStudent);
router.put('/:studentId', StudentHandlers.updateStudent);

module.exports = router;