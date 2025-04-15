import React, { useState, useEffect } from 'react';
import '../styles/BlogDetail.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/blogs/${id}`);
        setBlog(response.data.data);
        setLoading(false);

        // Tăng lượt xem
        await axios.put(`http://localhost:5001/api/blogs/${id}`, {
          ...response.data.data,
          views: response.data.data.views + 1
        });
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5001/api/blogs/${id}/comments`, {
        content: commentContent,
        author: commentAuthor
      });
      setBlog(response.data.data);
      setCommentContent('');
      setCommentAuthor('');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!blog) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      {blog.image && (
        <img
          src={`http://localhost:5001${blog.image}`}
          alt={blog.title}
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
        />
      )}
      <p>{blog.content}</p>
      <p><strong>Tags:</strong> {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}</p>
      <p><strong>Ngày tạo:</strong> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</p>
      <p><strong>Lượt xem:</strong> {blog.views}</p>
      <p><strong>Trạng thái:</strong> {blog.status}</p>

      <h3>Bình luận</h3>
      {blog.comments && blog.comments.length > 0 ? (
        blog.comments.map((comment, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <p><strong>{comment.author}</strong> ({new Date(comment.createdAt).toLocaleDateString('vi-VN')}):</p>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>Chưa có bình luận nào.</p>
      )}

      <h4>Thêm bình luận</h4>
      <form onSubmit={handleCommentSubmit}>
        <div>
          <label>Tên:</label>
          <input
            type="text"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nội dung:</label>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Gửi bình luận</button>
      </form>
    </div>
  );
};

export default BlogDetail;