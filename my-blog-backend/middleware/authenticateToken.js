const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Thiếu hoặc sai định dạng token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Gán id và role từ token
    req.user = {
      id: decoded.userId || decoded.id || decoded._id || decoded.sub,
      role: decoded.role || 'user'  // ➕ cần thiết cho checkAdmin
    };

    next();
  } catch (err) {
    console.error('[Auth Error]', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = authenticateToken;
