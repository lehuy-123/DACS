import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AdminReviewPage.css';

const AdminReviewPage = () => {
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // Thêm state cho thông báo
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchPendingBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/blogs?status=pending');
        setPendingBlogs(res.data.data);
      } catch (error) {
        console.error('Lỗi khi tải bài chờ duyệt:', error);
        setMessage({ type: 'error', text: 'Lỗi khi tải bài viết chờ duyệt.' });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBlogs();
  }, [user, navigate]);

  const handleApprove = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5001/api/blogs/${id}/approve`, { status });
      setPendingBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setMessage({ type: 'success', text: `Bài viết đã được ${status === 'approved' ? 'duyệt' : 'từ chối'} thành công!` });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      setMessage({ type: 'error', text: 'Lỗi khi cập nhật trạng thái bài viết.' });
    }
  };

  if (loading) {
    return (
      <div className="admin-review-page">
        <Header />
        <main className="review-content">
          <div className="loading-spinner">
            <p>Đang tải bài viết...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-review-page">
      <Header />
      <main className="review-content">
        <h1>Danh sách bài viết chờ duyệt</h1>
        {message && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}
        {pendingBlogs.length === 0 ? (
          <p className="no-blogs">Không có bài viết nào đang chờ duyệt.</p>
        ) : (
          <div className="review-list">
            {pendingBlogs.map((blog) => (
              <div key={blog._id} className="review-card">
                <div
                  className="review-card-main"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <h2 className="review-title">{blog.title}</h2>
                  <p className="review-content-preview">{blog.content?.substring(0, 150)}...</p>
                  <div className="review-meta">
                    <p className="review-tags">
                      <strong>Tag:</strong> {blog.tags?.join(', ') || 'Không có tag'}
                    </p>
                    <p className="review-date">
                      <strong>Ngày tạo:</strong>{' '}
                      {new Date(blog.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {blog.author && (
                      <p className="review-author">
                        <strong>Tác giả:</strong> {blog.author.name || 'Ẩn danh'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="review-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(blog._id, 'approved')}
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApprove(blog._id, 'rejected')}
                  >
                    ❌ Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminReviewPage;