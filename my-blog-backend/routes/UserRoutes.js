


const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/User');
const fbAuth = require('../middleware/fbAuth');

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

    // Tìm user theo fbId từ token
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




