
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkAdmin = require('../middleware/checkAdmin');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Tag = require('../models/Tag');

// 📊 Route thống kê dashboard
router.get('/stats', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Blog.countDocuments();
    const totalTags = await Tag.countDocuments();
    const totalViews = 0;

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

// 📄 Lấy danh sách bài viết theo trạng thái
router.get('/posts/:status', authenticateToken, checkAdmin, async (req, res) => {
  const status = req.params.status;
  try {
    const posts = await Blog.find({ status }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy bài viết' });
  }
});

// ✅ Duyệt bài viết
router.put('/posts/approve/:id', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi duyệt bài viết' });
  }
});

// ❌ Từ chối bài viết
router.put('/posts/reject/:id', authenticateToken, checkAdmin, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi từ chối bài viết' });
  }
});

// 🗑️ Xoá bài viết
router.delete('/posts/:id', authenticateToken, checkAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá bài viết' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá bài viết' });
  }
});

module.exports = router;
