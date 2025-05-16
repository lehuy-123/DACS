import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ApprovedPostTable.css';

const ApprovedPostTable = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/posts/approved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedPosts(res.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải bài đã duyệt:', err);
      }
    };
    fetchApprovedPosts();
  }, [token]);

  return (
    <div className="table-wrapper">
      <h2>Bài viết đã duyệt</h2>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Ngày duyệt</th>
          </tr>
        </thead>
        <tbody>
          {approvedPosts.map((post) => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.author?.name || 'Ẩn danh'}</td>
              <td>{new Date(post.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedPostTable;
