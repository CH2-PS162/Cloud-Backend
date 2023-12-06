const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication failed. Token not provided.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Authentication failed. Invalid token.',
      });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
