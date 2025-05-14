const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authenticateToken = require('../middleware/authMiddleware');

// Tạo comment
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }

    const comment = new Comment({
      content,
      post: postId,
      user: req.user.userId
    });
    await comment.save();

    res.status(201).json({ success: true, message: 'Bình luận thành công', comment });
  } catch (error) {
    console.error('Lỗi khi tạo comment:', error);
    next(error);
  }
});

// Lấy comment theo bài viết
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name');
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error('Lỗi khi lấy comment:', error);
    next(error);
  }
});

// Xóa comment (admin hoặc chính chủ comment)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }

    // Log debug để kiểm tra kỹ dữ liệu
    console.log('🟢 [XÓA COMMENT]');
    console.log('- Comment ID:', comment._id);
    console.log('- Comment user:', comment.user);
    console.log('- Req user:', req.user);

    // Nếu comment.user bị null hoặc undefined -> lỗi rõ ràng hơn
    if (!comment.user) {
      return res.status(500).json({
        success: false,
        message: 'Bình luận không có thông tin user. Có thể do lỗi khi tạo comment.'
      });
    }

    // Kiểm tra quyền: admin hoặc chính chủ comment mới được xoá
    if (req.user.role !== 'admin' && comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa bình luận này' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa comment:', error);
    next(error);
  }
});

module.exports = router;
