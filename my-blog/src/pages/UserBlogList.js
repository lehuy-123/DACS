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

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <h2>Danh sách bài viết</h2>
      {blogs.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ảnh</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tiêu đề</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nội dung</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tags</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ngày tạo</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lượt xem</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Trạng thái</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {blog.image ? (
                    <img
                      src={`http://localhost:5001${blog.image}`}
                      alt={blog.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                    />
                  ) : (
                    'Không có ảnh'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{blog.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {blog.content.length > 50 ? blog.content.substring(0, 50) + '...' : blog.content}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{blog.views}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{blog.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <Link to={`/blog/${blog._id}`}>
                    <button>Xem</button>
                  </Link>
                  <Link to={`/edit-blog/${blog._id}`}>
                    <button>Sửa</button>
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
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có bài viết nào.</p>
      )}
    </div>
  );
};

export default UserBlogList;