import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PostTable.css';


const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Lỗi khi tải bài viết:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5001/api/posts/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Cập nhật lại danh sách
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái bài viết:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá bài viết này?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Lỗi khi xoá bài viết:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="post-table">
      <h2>📄 Danh sách bài viết</h2>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.author?.name || 'Ẩn danh'}</td>
              <td>
                <select
                  value={post.status}
                  onChange={(e) => handleStatusChange(post._id, e.target.value)}
                >
                  <option value="draft">Nháp</option>
                  <option value="public">Công khai</option>
                </select>
              </td>
              <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
              <td>
                <button onClick={() => window.open(`/blog/${post._id}`, '_blank')}>Xem</button>
                <button className="danger" onClick={() => handleDelete(post._id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;
