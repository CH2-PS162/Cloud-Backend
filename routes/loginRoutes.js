const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Your User model

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // If user doesn't exist or password is incorrect
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token. 'BisaApaAjaTest21' Bisa diganti
    const token = jwt.sign({ username: user.username, role: user.role }, 'BisaApaAjaTest21', { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
