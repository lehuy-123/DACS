const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkAdmin = require('../middleware/checkAdmin');
const User = require('../models/User');
const Blog = require('../models/Blog');  // ✅ Đổi từ Post → Blog
const Tag = require('../models/Tag');

// 📊 Route thống kê dashboard
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Blog.countDocuments(); // ✅ Sửa lại đúng model
    const totalTags = await Tag.countDocuments();
    const totalViews = 0; // 🔧 Có thể cập nhật sau nếu lưu lượt xem

    const monthlyBlogs = await Blog.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ totalUsers, totalPosts, totalTags, totalViews, monthlyBlogs });
  } catch (err) {
    console.error('Lỗi thống kê:', err);
    res.status(500).json({ message: 'Lỗi server thống kê' });
  }
});

module.exports = router;
