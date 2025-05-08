// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có token' });
  }

  jwt.verify(token, 'secret_key_blog_app', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token không hợp lệ' });
    }

    // ✅ Đảm bảo luôn trả đúng structure: userId + role
    req.user = {
      userId: decoded.userId,
      role: decoded.role || 'user'  // fallback là 'user' nếu token chưa có role
    };

    next();
  });
};

module.exports = authenticateToken;
