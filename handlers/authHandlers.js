const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

const generateTokens = (user_id, email, name) => {
  const accessToken = jwt.sign({ user_id, email, name }, process.env.SESSION_SECRET, {
    expiresIn: '1h', 
  });

  const refreshToken = jwt.sign({ user_id, email, name }, process.env.REFRESH_SESSION_SECRET, {
    expiresIn: '1d',
  });

  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.getUserByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user.user_id, user.email, user.name);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
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
  generateTokens,
};
