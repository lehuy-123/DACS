import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/blogs');
        // Lọc các bài viết có status là 'public'
        const publicBlogs = response.data.data.filter(blog => blog.status === 'public');
        setBlogs(publicBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="home">
      <Header />
      <main>
        <h1>Blog Của Tao</h1>
        <p>
          Chào mừng bạn đến với blog của tao! Đây là nơi mình chia sẻ những bài viết thú vị về âm nhạc, cuộc sống và nhiều chủ đề khác. Hãy khám phá nhé!
        </p>
        <h2>Blog mới nhất</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : blogs.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                style={{
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '4px',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:5001${blog.image}`}
                    alt={blog.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
                  />
                )}
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                      {blog.title}
                    </Link>
                  </h3>
                  <p style={{ margin: '0 0 5px 0' }}>
                    {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                  </p>
                  <p style={{ margin: 0, color: '#666' }}>
                    Ngày tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')} | Lượt xem: {blog.views}
                  </p>
                  <p style={{ margin: 0, color: '#666' }}>
                    Tags: {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'Không có tag'}
                  </p>
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

export default Home;