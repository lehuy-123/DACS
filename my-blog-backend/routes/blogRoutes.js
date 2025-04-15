const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const mongoose = require('mongoose');

// POST /api/blogs - Tạo bài viết mới
router.post('/', async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: 'Tiêu đề và nội dung là bắt buộc' 
            });
        }

        const newBlog = new Blog({
            title,
            content,
            image: image || '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedBlog = await newBlog.save();
        
        res.status(201).json({
            success: true,
            data: savedBlog,
            message: 'Tạo bài viết thành công'
        });

    } catch (error) {
        next(error); // Chuyển lỗi đến error handler
    }
});

// GET /api/blogs - Lấy danh sách bài viết (có phân trang)
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [blogs, total] = await Promise.all([
            Blog.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Blog.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: blogs,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        next(error);
    }
});

// GET /api/blogs/:id - Lấy chi tiết bài viết
router.get('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        const blog = await Blog.findById(req.params.id).lean();
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });

    } catch (error) {
        next(error);
    }
});

// PUT /api/blogs/:id - Cập nhật bài viết
router.put('/:id', async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: 'Tiêu đề và nội dung là bắt buộc' 
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                image: image || '',
                updatedAt: new Date()
            },
            { 
                new: true,
                runValidators: true,
                lean: true 
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBlog,
            message: 'Cập nhật bài viết thành công'
        });

    } catch (error) {
        next(error);
    }
});

// DELETE /api/blogs/:id - Xóa bài viết
router.delete('/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID bài viết không hợp lệ'
            });
        }

        const deletedBlog = await Blog.findByIdAndDelete(req.params.id).lean();

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bài viết'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa bài viết thành công'
        });

    } catch (error) {
        next(error);
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Lỗi API:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi hệ thống'
    });
});

module.exports = router;