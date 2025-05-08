import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header'; // ✅ Thêm header
import '../styles/AdminPostsPage.css';

const AdminPostsPage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const fetchPendingPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/blogs?status=pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingPosts(res.data.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bài viết:', err);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/blogs/${postId}/approve`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Duyệt thành công!');
      fetchPendingPosts();
    } catch (err) {
      console.error('Lỗi khi duyệt bài:', err.response?.data || err.message);
      alert(`❌ Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleReject = async (postId) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/blogs/${postId}/approve`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('🚫 Đã từ chối bài viết');
      fetchPendingPosts();
    } catch (err) {
      console.error('Lỗi khi từ chối bài:', err.response?.data || err.message);
      alert(`❌ Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="main-layout">
      <Header /> {/* ✅ Header/navbar bên trái */}
      <div className="admin-posts-container">
        <h2 className="admin-posts-title">📄 Bài viết chờ duyệt</h2>
        {pendingPosts.length === 0 ? (
          <p className="no-posts-text">Không có bài viết nào đang chờ duyệt.</p>
        ) : (
          pendingPosts.map((post) => (
            <div key={post._id} className="admin-post-card">
              <img
                src={`http://localhost:5001${post.image}`}
                alt={post.title}
                className="admin-post-image"
              />
              <div className="admin-post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-snippet">{post.content.substring(0, 200)}...</p>
                <p className="post-tags">
                  <strong>Tags:</strong> {post.tags.join(', ')}
                </p>
                <div className="admin-post-actions">
                  <button className="approve-btn" onClick={() => handleApprove(post._id)}>
                    ✅ Duyệt
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(post._id)}>
                    🚫 Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPostsPage;
