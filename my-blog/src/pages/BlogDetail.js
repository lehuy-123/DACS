import React, { useState, useEffect } from 'react';
import '../styles/BlogDetail.css';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/blogs/${id}`);
        setBlog(response.data.data);
        console.log("📄 Blog chi tiết:", response.data.data); // ✅ Thêm dòng này
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

    const fetchRelatedBlogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/blogs/${id}/related`);
        setRelatedBlogs(res.data.data);
      } catch (err) {
        console.error('Lỗi khi load bài viết liên quan:', err);
      }
    };

    fetchBlog();
    fetchRelatedBlogs();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5001/api/blogs/${id}/comments`,
        {
          content: commentContent,
          author: user?.name || 'Ẩn danh'
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      // ✅ Update UI ngay mà không cần fetch lại toàn bộ
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data.data]
      }));
      setCommentContent('');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
      alert('Thêm bình luận thất bại');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bình luận này?')) return;
    console.log("🛠 Comment ID gửi xoá:", commentId);

    try {
      await axios.delete(`http://localhost:5001/api/blogs/${id}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      // ✅ Xoá thành công -> cập nhật lại UI
      setBlog(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
      alert('Xóa bình luận thành công');
    } catch (err) {
      console.error('Xóa bình luận thất bại:', err);
      alert('Xóa bình luận thất bại');
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!blog) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="blog-detail-container">
      <Header />
      <main>
        <div className="blog-main-grid">
          <div className="blog-main-left">
            <div className="blog-detail-content">
              {blog.image && (
                <img
                  src={`http://localhost:5001${blog.image}`}
                  alt={blog.title}
                  className="blog-detail-image"
                />
              )}

              <h2 className="blog-detail-title">{blog.title}</h2>

              <div className="blog-author" style={{ margin: '10px 0', fontSize: '15px', color: '#666' }}>
  <strong>Tác giả:</strong> {blog.userId?.name || 'Ẩn danh'}
</div>


              <div className="blog-content-markdown">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ node, ...props }) => (
                      <figure style={{ textAlign: 'center', margin: '20px 0' }}>
                        <img
                          {...props}
                          style={{
                            maxWidth: '100%',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                        {props.alt && (
                          <figcaption
                            style={{
                              fontSize: '14px',
                              color: '#666',
                              marginTop: '8px',
                              fontStyle: 'italic'
                            }}>
                            {props.alt}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>

              <div className="blog-meta">
                <span><strong>Tag:</strong> {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}</span>
                <span><strong>Ngày:</strong> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                <span><strong>Xem:</strong> {blog.views}</span>
                <span><strong>Trạng thái:</strong> {blog.status}</span>
              </div>

              <h3 className="comment-title">Bình luận</h3>
              <div className="comment-section">
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <p className="comment-author">
                        <strong>{comment.user?.name || comment.author || 'Ẩn danh'}</strong> ({new Date(comment.createdAt).toLocaleDateString('vi-VN')}):
                      </p>
                      <p className="comment-content">{comment.content}</p>

                      {/* Hiển thị nút xoá nếu là admin hoặc chính chủ */}
                      {user && (user.role === 'admin' || user._id === (comment.user?._id || comment.user)) && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>Chưa có bình luận nào.</p>
                )}
              </div>

              {user ? (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div>
                    <label>Người bình luận:</label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
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
                  <button type="submit">Gửi</button>
                </form>
              ) : (
                <p style={{ fontStyle: "italic", color: "gray" }}>
                  ⚠️ Vui lòng <a href="/login">đăng nhập</a> để bình luận.
                </p>
              )}
            </div>
          </div>

          <div className="blog-main-right">
            <div className="related-posts">
              <h3>Bài viết liên quan</h3>
              <div className="related-list">
                {relatedBlogs.length === 0 ? (
                  <p>Không có bài viết liên quan.</p>
                ) : (
                  relatedBlogs.map(blog => (
                    <Link to={`/blog/${blog._id}`} key={blog._id} className="related-item">
                      <img src={`http://localhost:5001${blog.image}`} alt={blog.title} />
                      <div className="related-item-content">
                        <p className="related-item-title">{blog.title}</p>
                        <p className="related-item-tags">
                          <strong>Tag:</strong> {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
