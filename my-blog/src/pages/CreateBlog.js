import React, { useState } from 'react';
import '../styles/CreateBlog.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('status', status);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5001/api/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-blogs');
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      alert('Tạo bài viết thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-blog-page">
      <Header />
      <main className="create-blog-container">
        <h2>Tạo bài viết mới</h2>
        <form onSubmit={handleSubmit} className="create-blog-form">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Nội dung:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung bài viết của bạn..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Ảnh đại diện:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Nhập các tag, ví dụ: công nghệ, du lịch"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Trạng thái:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="public">Công khai</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlog;