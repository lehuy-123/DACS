const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'public'],  // ✅ Thêm các trạng thái cần thiết
    default: 'pending'  // ✅ Khi user tạo mới sẽ là "pending"
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: [String],  // Mảng userId (string)
    default: []
  },
  bookmarks: {
    type: [String],  // Mảng userId (string)
    default: []
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
