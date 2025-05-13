exports.updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    post.status = status;
    await post.save();
    res.json({ message: 'Đã cập nhật trạng thái bài viết', post });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái' });
  }
};
