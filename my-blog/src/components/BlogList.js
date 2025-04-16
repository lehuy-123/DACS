import React, { useState, useEffect } from 'react';
import '../styles/BlogList.css';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/blogs');
        setBlogs(response.data.data); // Lấy dữ liệu từ response
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="blog-list-container">
      <Header />
      <main className="blog-list-content">
        <h2>Danh sách bài viết</h2>
        {blogs.length > 0 ? (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                {blog.image ? (
                  <img
                    src={`http://localhost:5001${blog.image}`}
                    alt={blog.title}
                  />
                ) : (
                  <p>Không có ảnh</p>
                )}
                <h3>
                  <a href={`/blog/${blog._id}`}>{blog.title}</a>
                </h3>
                <div className="blog-meta">
                  <p><strong>Lượt xem:</strong> <span>{blog.views || 0}</span></p>
                  <p><strong>Trạng thái:</strong> <span>{blog.status || 'Public'}</span></p>
                </div>
                <div className="blog-actions">
                  <a href={`/edit/${blog._id}`} className="edit-btn">Sửa</a>
                  <button
                    onClick={async () => {
                      if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                        await axios.delete(`http://localhost:5001/api/blogs/${blog._id}`);
                        setBlogs(blogs.filter((b) => b._id !== blog._id));
                      }
                    }}
                    className="delete-btn"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có bài viết nào.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;