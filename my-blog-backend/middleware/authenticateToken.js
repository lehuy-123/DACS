const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: đảm bảo luôn lấy đúng userId từ token do server sinh ra
    req.user = {
      id: decoded.userId || decoded.id || decoded._id || decoded.sub
    };

    next();
  } catch (err) {
    console.error('JWT Verify Failed:', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = authenticateToken;