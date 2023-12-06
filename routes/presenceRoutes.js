// presenceRoutes.js

const express = require('express');
const router = express.Router();
const PresenceHandlers = require('../handlers/presenceHandlers');

router.post('/mark', PresenceHandlers.markPresence);
router.get('/date/:date', PresenceHandlers.getPresenceByDate);

module.exports = router;
