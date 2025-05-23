import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [uniqueTags, setUniqueTags] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let queryParams = [];
        if (user?.role !== 'admin') queryParams.push('status=approved');
        if (filterType === 'tag' && filter) queryParams.push(`tag=${filter}`);
        if (filterType === 'category' && filter) queryParams.push(`category=${filter}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

        const res = await axios.get(`http://localhost:5001/api/blogs${queryString}`);
        const blogsData = res.data.data || [];
        setBlogs(blogsData);

        // Lấy unique tag từ tất cả bài
        const tags = new Set();
        blogsData.forEach((blog) => {
          if (blog.tags && blog.tags.length > 0) {
            blog.tags.forEach((tag) => tags.add(tag));
          }
        });
        setUniqueTags(Array.from(tags));
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [filter, filterType]);

  const handleLikeToggle = async (blogId) => {
    if (!user) {
      alert('Bạn cần đăng nhập để thả cảm xúc!');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5001/api/blogs/${blogId}/like`, { userId: user._id });
      if (res.data?.data) {
        const updatedBlog = res.data.data;
        setBlogs((prev) => prev.map((b) => (b._id === blogId ? updatedBlog : b)));
      }
    } catch (error) {
      console.error('Lỗi khi thả cảm xúc:', error);
    }
  };

  const handleBookmarkToggle = async (blogId) => {
    if (!user) {
      alert('Bạn cần đăng nhập để lưu bài viết!');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:5001/api/blogs/${blogId}/bookmark`, { userId: user._id });
      if (res.data?.data) {
        const updatedBlog = res.data.data;
        setBlogs((prev) => prev.map((b) => (b._id === blogId ? updatedBlog : b)));
      }
    } catch (error) {
      console.error('Lỗi khi lưu bài viết:', error);
    }
  };

  return (
    <div className="home-container">
      <Header />
      <main className="home-content">
        <h1 className="main-title">Chào mừng đến Blog của Tôi</h1>
        <p className="sub-title">Nơi chia sẻ những kiến thức, cảm hứng và câu chuyện thú vị!</p>

        {/* Dropdown Filter Section */}
        <div className="dropdown-filter">
          <div className="dropdown">
            <button className="dropdown-btn">Danh mục ⌄</button>
            <div className="dropdown-content">
              {uniqueTags.map((tag) => (
                <div
                  key={tag}
                  className="dropdown-item"
                  onClick={() => {
                    setFilter(tag);
                    setFilterType('tag');
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button
            className="filter-clear"
            onClick={() => {
              setFilter('');
              setFilterType('');
            }}
          >
            Xóa lọc
          </button>
        </div>

        <div className="blogs-section">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="skeleton"></div>)
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <div className="blog-card-clickable" onClick={() => navigate(`/blog/${blog._id}`)}>
                  <div className="blog-card-image">
                    <img
                      src={blog?.image ? `http://localhost:5001${blog.image}` : 'https://via.placeholder.com/400x250'}
                      alt={blog.title}
                      loading="lazy"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/400x250')}
                    />
                    <span className="blog-card-tag">{blog?.tags?.[0] || 'No Tag'}</span>
                  </div>
                  <div className="blog-card-content">
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-card-desc">{blog.content?.substring(0, 100)}...</p>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                      <img
                        src={blog.author?.avatar || 'https://via.placeholder.com/40'}
                        alt="User"
                        className="blog-card-avatar"
                      />
                    </div>
                    <div className="blog-card-status">
                      <strong>Trạng thái: </strong>
                      <span
                        style={{
                          color:
                            blog.status === 'approved'
                              ? 'green'
                              : blog.status === 'pending'
                              ? 'orange'
                              : 'red'
                        }}
                      >
                        {blog.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="blog-actions">
                  <div className="blog-action-left">
                    <button
                      className={`action-btn like ${
                        safeArray(blog.likes).includes(user?._id) ? 'liked' : ''
                      }`}
                      onClick={() => handleLikeToggle(blog._id)}
                    >
                      {safeArray(blog.likes).length} Cảm xúc
                    </button>
                    <i
                      className={`fas ${
                        safeArray(blog.bookmarks).includes(user?._id)
                          ? 'fa-bookmark'
                          : 'fa-bookmark far'
                      } bookmark-icon`}
                      onClick={() => handleBookmarkToggle(blog._id)}
                    ></i>
                  </div>
                  <div className="blog-action-right">
                    <button className="action-btn" onClick={() => navigate(`/blog/${blog._id}`)}>
                      <i className="far fa-comment"></i>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(`${window.location.origin}/blog/${blog._id}`)
                      }
                    >
                      <i className="fas fa-share"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="loading-text">Không có bài viết nào.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
