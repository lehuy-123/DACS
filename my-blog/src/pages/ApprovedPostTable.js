
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovedPostTable = () => {
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchApprovedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/posts/approved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải bài viết đã duyệt:', err);
    }
  };

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  return (
    <div>
      <h3>📄 Danh sách bài viết đã duyệt</h3>
      {posts.length === 0 ? (
        <p>Không có bài viết đã duyệt.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author?.email || 'Ẩn danh'}</td>
                <td>✅ Đã duyệt</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovedPostTable;
