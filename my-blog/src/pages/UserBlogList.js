import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteBlogButton from '../components/DeleteBlogButton';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/UserBlogList.css';
import api from '../api/api';

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/user/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = (blogId) => {
    setBlogs(blogs.filter((blog) => blog.id !== blogId));
  };

  return (
    <div className="user-blog-list">
      <Header />
      <main>
        <h2>Bài viết của bạn</h2>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-item">
              <img src={blog.image} alt={blog.title} loading="lazy" />
              <h3>{blog.title}</h3>
              <p>Lượt xem: {blog.views}</p>
              <p>Trạng thái: {blog.status}</p>
              <Link to={`/edit-blog/${blog.id}`}>Chỉnh sửa</Link>
              <DeleteBlogButton blogId={blog.id} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserBlogList;