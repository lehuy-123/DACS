const express = require('express');
const multer = require('multer');
const router = express.Router();

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Route upload ảnh (cho ảnh nội dung bài viết)
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file được tải lên' });
    }
    const url = `http://localhost:5001/uploads/${req.file.filename}`;
    return res.json({ url });
});

module.exports = router;
