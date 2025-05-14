
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingPostTable = () => {
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchPendingPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/posts/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải bài viết chờ duyệt:', err);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/posts/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendingPosts();
    } catch (err) {
      console.error('Lỗi khi duyệt bài viết:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/posts/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendingPosts();
    } catch (err) {
      console.error('Lỗi khi từ chối bài viết:', err);
    }
  };

  return (
    <div>
      <h3>📄 Danh sách bài viết chờ duyệt</h3>
      {posts.length === 0 ? (
        <p>Không có bài viết nào đang chờ duyệt.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author?.email || 'Ẩn danh'}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleApprove(post._id)}>✅ Duyệt</button>
                  <button onClick={() => handleReject(post._id)} style={{ marginLeft: '8px' }}>
                    ❌ Từ chối
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPostTable;
