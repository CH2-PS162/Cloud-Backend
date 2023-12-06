const express = require('express');
const router = express.Router();
const AuthHandlers = require('../handlers/authHandlers');

// POST request to handle user login
router.post('/login', AuthHandlers.login);

// POST request to handle user logout
router.post('/logout', AuthHandlers.logout);

module.exports = router;