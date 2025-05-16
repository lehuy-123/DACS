exports.getPosts = async (req, res) => {
  try {
    const { search = '', page = 1, status } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const keyword = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Nếu có status, lọc theo status; nếu không có thì lấy tất cả
    const filter = status
      ? { ...keyword, status }
      : { ...keyword };

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Lỗi khi lấy bài viết:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy bài viết' });
  }
};



// controllers/PostController.js
exports.approvePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    post.status = 'approved';
    await post.save();

    res.status(200).json({ message: 'Bài viết đã được duyệt', post });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi duyệt bài viết', error: error.message });
  }
};
