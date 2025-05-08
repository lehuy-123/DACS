






import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/CommentSection.css';

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments?blogId=${blogId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy bình luận:', error);
      }
    };
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post('/comments', {
        blogId,
        content: newComment,
        user: JSON.parse(localStorage.getItem('user'))?.name || 'Ẩn danh',
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Bình luận</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Gửi</button>
      </form>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              <strong>{comment.user}</strong>: {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
