// controllers/AuthController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role  // ✅ NHỚ thêm quyền vào token
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 📌 Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // hoặc 'admin' nếu bạn chỉ định
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ success: true, message: 'Đăng ký thành công', token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 📌 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Sai mật khẩu' });

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role // ✅ frontend sẽ dùng thông tin này
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
