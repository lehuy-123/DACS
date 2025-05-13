const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/User');
const fbAuth = require('../middleware/fbAuth');
const authenticateToken = require('../middleware/authMiddleware'); // ✅ Middleware xác thực bằng JWT (admin)

// ⚙️ Cấu hình lưu ảnh avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu avatar
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

/**
 * ✅ GET /api/users - Lấy danh sách người dùng (admin dashboard)
 * Hỗ trợ: ?search=...&page=1
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

// ✅ PUT /api/users/:id - Cập nhật thông tin người dùng
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

// ✅ POST /api/users/avatar - Upload avatar người dùng
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

module.exports = router;
