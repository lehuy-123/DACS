import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CreateBlog.css';
import api from '../api/api';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('tags', tags.split(',').map((tag) => tag.trim()));
    formData.append('status', status);

    try {
      await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Tạo bài viết thành công!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      alert('Tạo bài viết thất bại.');
    }
  };

  return (
    <div className="create-blog">
      <Header />
      <main>
        <h2>Tạo bài viết</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Nội dung"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}
          <input
            type="text"
            placeholder="Tags (cách nhau bởi dấu phẩy)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Bản nháp</option>
            <option value="public">Công khai</option>
          </select>
          <button type="submit">Tạo bài viết</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlog;