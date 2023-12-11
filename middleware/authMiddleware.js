const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // Replace with your secret key

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;