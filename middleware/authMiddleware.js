//authMiddleware

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
