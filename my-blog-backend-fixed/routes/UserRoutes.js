const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/User');
const fbAuth = require('../middleware/fbAuth');
const authenticateToken = require('../middleware/authMiddleware');

// ⚙️ Cấu hình lưu ảnh avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * ✅ GET /api/users - Lấy danh sách người dùng (admin dashboard)
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find(keyword).skip(skip).limit(limit);
    const total = await User.countDocuments(keyword);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET /api/users/:id - Lấy thông tin người dùng
router.get('/:id', fbAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID người dùng không hợp lệ' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ✅ PUT /api/users/:id - Cập nhật thông tin người dùng (theo fbAuth)
router.put('/:id', fbAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID người dùng không hợp lệ' });
    }

    const currentUser = await User.findOne({ fbId: req.user.fbId });

    if (!currentUser || currentUser._id.toString() !== id.toString()) {
      return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
    }

    currentUser.name = name || currentUser.name;
    currentUser.email = email || currentUser.email;
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      user: currentUser,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ POST /api/users/avatar - Upload avatar
router.post('/avatar', fbAuth, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có ảnh được gửi' });
    }

    const currentUser = await User.findOne({ fbId: req.user.fbId });
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    currentUser.avatar = `/uploads/${req.file.filename}`;
    await currentUser.save();

    res.status(200).json({
      success: true,
      message: 'Upload avatar thành công',
      avatarUrl: currentUser.avatar,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ PATCH /api/users/:id/block - Chặn/mở chặn người dùng
router.patch('/:id/block', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.userId === id) {
      return res.status(403).json({ message: 'Không thể chặn chính tài khoản của bạn' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? 'Người dùng đã bị chặn' : 'Đã mở chặn người dùng',
    });
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE /api/users/:id - Xoá user
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.userId === id) {
      return res.status(403).json({ message: 'Không thể xoá tài khoản của chính bạn' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xoá người dùng thành công',
    });
  } catch (err) {
    next(err);
  }
});



// ✅ PATCH /api/users/:id/info - Admin cập nhật tên/email người dùng
router.patch('/:id/info', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.user.userId === id) {
      return res.status(403).json({ message: 'Không thể chỉnh sửa hồ sơ chính bạn tại đây' });
    }

    if (!name && !email) {
      return res.status(400).json({ message: 'Không có dữ liệu cập nhật' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ success: true, message: 'Đã cập nhật thông tin người dùng' });
  } catch (err) {
    next(err);
  }
});







// ✅ PATCH /api/users/:id/role - Thay đổi vai trò user <=> admin
router.patch('/:id/role', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.userId === id) {
      return res.status(403).json({ message: 'Không thể thay đổi vai trò của chính bạn' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Đã cập nhật vai trò thành "${role}"`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
