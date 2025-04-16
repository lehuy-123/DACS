import React, { useState, useEffect } from 'react';
import '../styles/UserBlogList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/blogs');
        setBlogs(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p className="loading-text">Đang tải...</p>;

  return (
    <div className="container">
      <h2 className="title">Danh sách bài viết</h2>
      {blogs.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th>Tags</th>
                <th>Ngày tạo</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    {blog.image ? (
                      <img
                        src={`http://localhost:5001${blog.image}`}
                        alt={blog.title}
                        className="image"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                      />
                    ) : (
                      <span className="no-image-text">Không có ảnh</span>
                    )}
                  </td>
                  <td className="title-text">{blog.title}</td>
                  <td className="content-text">
                    {blog.content.length > 50 ? blog.content.substring(0, 50) + '...' : blog.content}
                  </td>
                  <td>
                    {blog.tags && blog.tags.length > 0 ? (
                      <span className="tags-text">{blog.tags.join(', ')}</span>
                    ) : (
                      <span className="no-tags-text">Không có tag</span>
                    )}
                  </td>
                  <td className="date-text">
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="views-text">{blog.views}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        blog.status === 'public' ? 'status-public' : 'status-not-public'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Link to={`/blog/${blog._id}`}>
                      <button className="button button-view">Xem</button>
                    </Link>
                    <Link to={`/edit-blog/${blog._id}`}>
                      <button className="button button-edit">Sửa</button>
                    </Link>
                    <button
                      onClick={async () => {
                        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                          try {
                            await axios.delete(`http://localhost:5001/api/blogs/${blog._id}`);
                            setBlogs(blogs.filter((b) => b._id !== blog._id));
                          } catch (error) {
                            console.error('Lỗi khi xóa bài viết:', error);
                          }
                        }
                      }}
                      className="button button-delete"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-blogs-text">Không có bài viết nào.</p>
      )}
    </div>
  );
};

export default UserBlogList;