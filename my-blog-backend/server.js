const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');




const BlogRoutes = require('./routes/BlogRoutes');
const postRoutes = require('./routes/PostRoutes');
const UserRoutes = require('./routes/UserRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const TestRoutes = require('./routes/TestRoutes');
const UploadRoutes = require('./routes/UploadRoutes');
const authenticateToken = require('./middleware/authMiddleware');
const tagRoutes = require('./routes/TagRoutes');

require('./db'); // Kết nối MongoD/
require('dotenv').config();


dotenv.config();

const app = express();

// ✅ Middleware chung - ĐÃ SỬA CORS CHUẨN
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // ✅ Cho phép cả 3000 và 3001
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],         // ✅ Thêm PATCH
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use('/api/posts', postRoutes);

app.use('/api/users', authenticateToken, UserRoutes);
app.use('/api', UploadRoutes);  // ✅ thêm mới


app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', adminRoutes);
app.use('/api/tags', tagRoutes);

// ✅ Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// ✅ Cấu hình Passport Facebook
app.use(passport.initialize());

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.error('❌ Thiếu FACEBOOK_APP_ID hoặc FACEBOOK_APP_SECRET trong file .env');
    process.exit(1);
}

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:5001/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const User = require('./models/User');
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
            user = new User({
                facebookId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value || '',
                avatar: profile.photos?.[0]?.value || ''
            });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
        return done(null, { user, token });
    } catch (err) {
        return done(err, null);
    }
}));

// ✅ Route Facebook login
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
        const { user, token } = req.user;
        res.redirect(`http://localhost:3001/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }))}`);
    }
);

// ✅ Các route chính
app.use('/api/auth', AuthRoutes);
app.use('/api', TestRoutes); // Route test token
app.use('/api/blogs', BlogRoutes); // Public
app.use('/api/users', authenticateToken, UserRoutes); // Private

// ✅ Route test server
app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Server đang hoạt động' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Lỗi:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Lỗi máy chủ nội bộ',
        error: err.message
    });
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});


/* nếu local http://localhost:3001 như này thì check lại file server.js sửa lại  res.redirect(`http://localhost:3001/login?token=${token}&user=${encodeURIComponent(JSON.stringify( 
 dòng này nữa:  callbackURL: 'http://localhost:5001/auth/facebook/callback'
 check lại home.js sửa này nữa  const response = await axios.get('http://localhost:5001/api/blogs');

 đảm bảo trùng với link local đang chạy
 ,/*/