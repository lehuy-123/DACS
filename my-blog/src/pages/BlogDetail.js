import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import '../styles/BlogDetail.css';
import api from '../api/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div>Đang tải...</div>;

  return (
    <div className="blog-detail">
      <Header />
      <main>
        <h1>{blog.title}</h1>
        <img src={blog.image} alt={blog.title} className="blog-image" loading="lazy" />
        <div className="blog-content">{blog.content}</div>
        <CommentSection blogId={id} />
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;