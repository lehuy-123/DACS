const User = require('../models/User');

const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId); // hoặc req.user.userId nếu xài JWT middleware

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền admin' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = checkAdmin;
