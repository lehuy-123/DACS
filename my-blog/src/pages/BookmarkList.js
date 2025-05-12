import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/BookmarkList.css';

const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  console.log('User hiện tại:', user);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user._id) {
        console.error('Không tìm thấy user hoặc thiếu _id');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5001/api/blogs');
        const allBlogs = res.data.data || [];
        const bookmarkedBlogs = allBlogs.filter(blog =>
          Array.isArray(blog.bookmarks) && blog.bookmarks.includes(user._id)
        );
        setBookmarks(bookmarkedBlogs);
      } catch (error) {
        console.error('Lỗi khi lấy bookmark:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="main-layout">
      <Header />
      <div className="bookmark-page">
        <h2 className="bookmark-title">Danh sách bài viết đã lưu</h2>

        {loading ? (
          <div className="bookmark-loading">Đang tải danh sách bài viết đã lưu...</div>
        ) : bookmarks.length === 0 ? (
          <div className="bookmark-empty">Chưa có bài viết nào được lưu.</div>
        ) : (
          <div className="bookmark-grid">
            {bookmarks.map((post) => (
              <div key={post._id} className="bookmark-card">
                <div className="bookmark-image-container">
                  <Link to={`/blog/${post._id}`}>
                    <img
                      src={`http://localhost:5001${post.image}`}
                      alt={post.title}
                      className="bookmark-image"
                    />
                  </Link>
                  <span className="bookmark-tag">
                    {post.tags && post.tags.length > 0 ? post.tags[0] : 'No Tag'}
                  </span>
                </div>
                <div className="bookmark-content">
                  <h3 className="bookmark-post-title">{post.title}</h3>
                  <p className="bookmark-description">{post.content.slice(0, 100)}...</p>
                  <div className="bookmark-meta">
                    <p className="bookmark-date">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="bookmark-status">
                      Trạng thái: {post.status || 'APPROVED'}
                    </p>
                  </div>
                  
                  </div>
                </div>
              
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkList;