const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'public'],
      default: 'draft'
    }
  },
  {
    timestamps: true // Tự động tạo createdAt, updatedAt
  }
);

module.exports = mongoose.model('Post', postSchema);
