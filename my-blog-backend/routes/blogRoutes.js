const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const upload = require('./uploads');

// POST /api/blogs - Tạo bài viết mới
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
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
      status: 'pending',
      views: 0,
      comments: [],
      likes: [],
      bookmarks: []
    };
    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Tạo bài viết thành công, đang chờ duyệt'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs - Lấy danh sách bài viết
router.get('/', async (req, res, next) => {
  try {
    const { tag, status } = req.query;
    const query = {};
    query.status = status || 'approved';
    if (tag) query.tags = tag;
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
      message: 'Lấy danh sách bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/blogs/:id/approve
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    blog.status = status;
    await blog.save();
    res.status(200).json({ success: true, message: `Bài viết đã được cập nhật trạng thái: ${status}` });
  } catch (error) {
    next(error);
  }
});

// Lấy bài viết liên quan
router.get('/:id/related', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    let relatedBlogs = [];
    if (blog.tags && blog.tags.length > 0) {
      relatedBlogs = await Blog.find({
        _id: { $ne: blog._id },
        tags: { $in: blog.tags }
      }).limit(5);
    }
    res.status(200).json({
      success: true,
      data: relatedBlogs,
      message: 'Lấy danh sách bài viết liên quan thành công'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs/:id - Lấy chi tiết bài viết
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// PUT /api/blogs/:id - Cập nhật bài viết
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : blog.tags;
    blog.status = status || blog.status;
    blog.image = req.file ? `/uploads/${req.file.filename}` : blog.image;
    await blog.save();
    res.status(200).json({ success: true, data: blog, message: 'Cập nhật bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:id - Xoá bài viết
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

// Upload ảnh
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng gửi file ảnh' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { imageUrl }, message: 'Upload ảnh thành công' });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/:id/comments - Thêm bình luận
router.post('/:id/comments', async (req, res, next) => {
  const { content, author } = req.body;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    if (!content || !author) {
      return res.status(400).json({ success: false, message: 'Nội dung và tác giả là bắt buộc' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      content,
      author
    };
    blog.comments.push(comment);
    await blog.save();
    res.status(201).json({
      success: true,
      data: comment,
      message: 'Thêm bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:blogId/comments/:commentId - Xoá bình luận ✅
router.delete('/:blogId/comments/:commentId', async (req, res, next) => {
  const { blogId, commentId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: 'ID bài viết hoặc ID bình luận không hợp lệ' });
    }
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }
    blog.comments.splice(commentIndex, 1);
    await blog.save();
    res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (error) {
    next(error);
  }
});


// DELETE /api/blogs/:blogId/comments/:commentId - Xóa 1 comment nhúng
router.delete('/:blogId/comments/:commentId', async (req, res) => {
  const { blogId, commentId } = req.params;
  try {
    // Check Blog tồn tại không
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    // Tìm index comment trong mảng comments
    const commentIndex = blog.comments.findIndex(
      (cmt) => cmt._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }

    // Xoá comment
    blog.comments.splice(commentIndex, 1);
    await blog.save();

    return res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});


// POST /api/blogs/:id/like
router.post('/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const index = blog.likes.indexOf(userId);
    if (index > -1) {
      blog.likes.splice(index, 1);
    } else {
      blog.likes.push(userId);
    }
    await blog.save();
    res.status(200).json({ success: true, data: blog, message: 'Cập nhật cảm xúc thành công' });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/:id/bookmark
router.post('/:id/bookmark', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const index = blog.bookmarks.indexOf(userId);
    if (index > -1) {
      blog.bookmarks.splice(index, 1);
      await blog.save();
      return res.status(200).json({ success: true, message: 'Đã gỡ bookmark' });
    } else {
      blog.bookmarks.push(userId);
      await blog.save();
      return res.status(200).json({ success: true, message: 'Đã lưu bookmark' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;



/* 
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const upload = require('./uploads');

// POST /api/blogs - Tạo bài viết mới
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
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
      status: 'pending',
      views: 0,
      comments: [],
      likes: [],
      bookmarks: []
    };
    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Tạo bài viết thành công, đang chờ duyệt'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs - Lấy danh sách bài viết
router.get('/', async (req, res, next) => {
  try {
    const { tag, status } = req.query;
    const query = {};
    query.status = status || 'approved';
    if (tag) query.tags = tag;
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
      message: 'Lấy danh sách bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/blogs/:id/approve
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    blog.status = status;
    await blog.save();
    res.status(200).json({ success: true, message: `Bài viết đã được cập nhật trạng thái: ${status}` });
  } catch (error) {
    next(error);
  }
});

// Lấy bài viết liên quan
router.get('/:id/related', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    let relatedBlogs = [];
    if (blog.tags && blog.tags.length > 0) {
      relatedBlogs = await Blog.find({
        _id: { $ne: blog._id },
        tags: { $in: blog.tags }
      }).limit(5);
    }
    res.status(200).json({
      success: true,
      data: relatedBlogs,
      message: 'Lấy danh sách bài viết liên quan thành công'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/blogs/:id - Lấy chi tiết bài viết
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// PUT /api/blogs/:id - Cập nhật bài viết
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : blog.tags;
    blog.status = status || blog.status;
    blog.image = req.file ? `/uploads/${req.file.filename}` : blog.image;
    await blog.save();
    res.status(200).json({ success: true, data: blog, message: 'Cập nhật bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:id - Xoá bài viết
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

// Upload ảnh
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng gửi file ảnh' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { imageUrl }, message: 'Upload ảnh thành công' });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/:id/comments - Thêm bình luận
router.post('/:id/comments', async (req, res, next) => {
  const { content, author } = req.body;
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    if (!content || !author) {
      return res.status(400).json({ success: false, message: 'Nội dung và tác giả là bắt buộc' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      content,
      author
    };
    blog.comments.push(comment);
    await blog.save();
    res.status(201).json({
      success: true,
      data: comment,
      message: 'Thêm bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:blogId/comments/:commentId - Xoá bình luận ✅
router.delete('/:blogId/comments/:commentId', async (req, res, next) => {
  const { blogId, commentId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: 'ID bài viết hoặc ID bình luận không hợp lệ' });
    }
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }
    blog.comments.splice(commentIndex, 1);
    await blog.save();
    res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/blogs/:blogId/comments/:commentId - Xóa 1 comment nhúng
router.delete('/:blogId/comments/:commentId', async (req, res) => {
  const { blogId, commentId } = req.params;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    // Kiểm tra comment tồn tại chưa
    const comment = blog.comments.id(commentId);  // ✅ DÙNG .id() của Mongoose subdocument

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }

    // Xoá comment
    comment.remove();
    await blog.save();

    return res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});



// POST /api/blogs/:id/like
router.post('/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const index = blog.likes.indexOf(userId);
    if (index > -1) {
      blog.likes.splice(index, 1);
    } else {
      blog.likes.push(userId);
    }
    await blog.save();
    res.status(200).json({ success: true, data: blog, message: 'Cập nhật cảm xúc thành công' });
  } catch (error) {
    next(error);
  }
});

// POST /api/blogs/:id/bookmark
router.post('/:id/bookmark', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID bài viết không hợp lệ' });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    const index = blog.bookmarks.indexOf(userId);
    if (index > -1) {
      blog.bookmarks.splice(index, 1);
      await blog.save();
      return res.status(200).json({ success: true, message: 'Đã gỡ bookmark' });
    } else {
      blog.bookmarks.push(userId);
      await blog.save();
      return res.status(200).json({ success: true, message: 'Đã lưu bookmark' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
*/