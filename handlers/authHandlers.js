// authHandlers.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.getUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // You can adjust the token expiration time as needed
    });

    return res.status(200).json({ status: 'success', data: { accessToken } });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to login' });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await UserModel.createUser({ email, password: hashedPassword });

    return res.status(201).json({ status: 'success', data: { user } });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Failed to register user' });
  }
};

module.exports = {
  login,
  register,
};
