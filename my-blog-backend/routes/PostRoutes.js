const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authenticateToken = require('../middleware/authenticateToken');

// 📌 Tạo bài viết mới
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { title, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung là bắt buộc' });
    }

    const post = new Post({
      title,
      content,
      status: status || 'draft',
      author: req.user.id
    });

    await post.save();
    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      post
    });
  } catch (error) {
    next(error);
  }
});

// 📌 Lấy bài viết theo ID
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
