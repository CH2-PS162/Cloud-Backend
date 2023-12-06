// resultRoutes.js

const express = require('express');
const router = express.Router();
const ResultHandlers = require('../handlers/resultHandlers');

router.get('/', ResultHandlers.getAllResults);
router.post('/', ResultHandlers.addResult);
router.delete('/:resultId', ResultHandlers.deleteResult);
router.put('/:resultId', ResultHandlers.updateResult);

module.exports = router;
