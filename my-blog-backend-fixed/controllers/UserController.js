const User = require('../models/User');

// 📌 GET /api/users?search=&page=
exports.getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      users,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// 📌 PATCH /api/users/:id/block
exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: user.isBlocked ? 'Đã chặn người dùng' : 'Đã mở chặn người dùng' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi chặn/mở chặn người dùng' });
  }
};

// 📌 DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({ message: 'Đã xoá người dùng' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi xoá người dùng' });
  }
};
