import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import '../styles/BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setBlogs(response.data);
        setError(null); // Xóa lỗi nếu lấy dữ liệu thành công
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="blog-list">
      {error && <p className="error">{error}</p>} {/* Hiển thị thông báo lỗi nếu có */}
      {blogs.length === 0 && !error ? (
        <p>Chưa có bài viết nào.</p> // Thông báo khi không có bài viết
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <Link to={`/blog/${blog.id}`}>
              <img src={blog.image} alt={blog.title} />
              <h3>{blog.title}</h3>
              <p>{blog.content?.substring(0, 100)}...</p> {/* Hiển thị 100 ký tự đầu của nội dung */}
              <p><small>Ngày đăng: {blog.createdAt || 'Không có ngày'}</small></p>
              <p><small>Tác giả: {blog.userId || 'Ẩn danh'}</small></p>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList;