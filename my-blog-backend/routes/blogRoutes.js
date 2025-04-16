const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const upload = require('./uploads');

// POST /api/blogs - Tạo bài viết mới
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề và nội dung là bắt buộc'
      });
    }

    const blogData = {
      title,
      content,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [],
      status: status || 'public',
      views: 0,
      comments: []
    };

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Tạo bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs - Lấy danh sách bài viết (hỗ trợ filter theo tag)
router.get('/', async (req, res, next) => {
  try {
    const { tag } = req.query; // Lấy query param 'tag'

    const query = { status: 'public' }; // Chỉ lấy bài viết public
    if (tag) {
      query.tags = tag; // Lọc theo tag
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.status(200).json({
      success: true,
      data: blogs,
      message: 'Lấy danh sách bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs/:id - Lấy chi tiết 1 bài viết
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
      message: 'Lấy chi tiết bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/blogs/:id - Cập nhật bài viết
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Cập nhật các trường
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : blog.tags;
    blog.status = status || blog.status;
    blog.image = req.file ? `/uploads/${req.file.filename}` : blog.image;

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:id - Xóa bài viết
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/upload - Upload ảnh bài viết
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng gửi file ảnh'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: { imageUrl },
      message: 'Upload ảnh thành công'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/:id/comments - Thêm bình luận mới (giữ nguyên)
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