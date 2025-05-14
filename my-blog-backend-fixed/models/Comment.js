const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Nếu model user bạn đặt tên khác (ví dụ AppUser), đổi lại đây nhé
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
