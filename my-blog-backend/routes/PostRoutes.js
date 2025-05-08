const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.id
    });
    await post.save();
    res.status(201).json({ success: true, message: 'Tạo bài viết thành công', post });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
});

module.exports = router;