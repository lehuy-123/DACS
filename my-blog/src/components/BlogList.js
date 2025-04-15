import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Danh sách bài viết</h2>
      {blogs.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ảnh</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tiêu đề</th>
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
                      src={`http://localhost:5001/${blog.image}`}
                      alt={blog.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'Không có ảnh'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{blog.title}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td> {/* Lượt xem chưa có trong schema, tạm để 0 */}
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {blog.status || 'Public'} {/* Trạng thái chưa có trong schema, mặc định là Public */}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => window.location.href = `/edit/${blog._id}`}>Sửa</button>
                  <button onClick={async () => {
                    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
                      await axios.delete(`http://localhost:5001/api/blogs/${blog._id}`);
                      setBlogs(blogs.filter((b) => b._id !== blog._id));
                    }
                  }}>Xóa</button>
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

export default BlogList;