const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const upload = require('./uploads');

// POST /api/blogs - Tạo bài viết mới
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề và nội dung là bắt buộc'
      });
    }

    // Tạo dữ liệu bài viết
    const blogData = {
      title,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'public',
      views: 0,
      comments: []
    };

    // Lưu bài viết vào MongoDB
    const blog = new Blog(blogData);
    await blog.save();

    // Trả về response
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Tạo bài viết thành công'
    });
  } catch (error) {
    next(error); // Chuyển lỗi đến global error handler
  }
});

// POST /api/blogs/:id/comments - Thêm bình luận mới
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    if (!content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung và tác giả là bắt buộc'
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    blog.comments.push({ content, author });
    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Thêm bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;