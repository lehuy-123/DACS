import React, { useState, useEffect } from 'react';
import '../styles/BlogDetail.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <div className="blog-detail-container">
      <Header />
      <main>
        <div className="blog-detail-content">
          <h2>{blog.title}</h2>
          {blog.image && (
            <img
              src={`http://localhost:5001${blog.image}`}
              alt={blog.title}
            />
          )}
          <p>{blog.content}</p>
          <div className="blog-meta">
            <span><strong>Tags:</strong> {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}</span>
            <span><strong>Ngày tạo:</strong> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
            <span><strong>Lượt xem:</strong> {blog.views}</span>
            <span><strong>Trạng thái:</strong> {blog.status}</span>
          </div>

          <h3>Bình luận</h3>
          <div className="comment-section">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <p><strong>{comment.author}</strong> ({new Date(comment.createdAt).toLocaleDateString('vi-VN')}):</p>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>

          <h4>Thêm bình luận</h4>
          <form onSubmit={handleCommentSubmit} className="comment-form">
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
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;