
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RejectedPostTable = () => {
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchRejectedPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/posts/rejected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tải bài viết bị từ chối:', err);
    }
  };

  useEffect(() => {
    fetchRejectedPosts();
  }, []);

  return (
    <div>
      <h3>🔴 Danh sách bài viết bị từ chối</h3>
      {posts.length === 0 ? (
        <p>Không có bài viết nào bị từ chối.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author?.email || 'Ẩn danh'}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RejectedPostTable;
