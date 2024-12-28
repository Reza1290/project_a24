const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Cek dari cookie atau header

  if (!token) {
    return res.status(403).json({ message: 'Token diperlukan untuk akses' });
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
