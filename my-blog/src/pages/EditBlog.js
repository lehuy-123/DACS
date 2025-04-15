import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/EditBlog.css';
import api from '../api/api';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        const blog = response.data;
        setTitle(blog.title);
        setContent(blog.content);
        setImagePreview(blog.image);
        setTags(blog.tags.join(', '));
        setStatus(blog.status);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
      }
    };
    fetchBlog();
  }, [id]);

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
    if (image) formData.append('image', image);
    formData.append('tags', tags.split(',').map((tag) => tag.trim()));
    formData.append('status', status);

    try {
      await api.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Cập nhật bài viết thành công!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      alert('Cập nhật bài viết thất bại.');
    }
  };

  return (
    <div className="edit-blog">
      <Header />
      <main>
        <h2>Chỉnh sửa bài viết</h2>
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
          <button type="submit">Cập nhật bài viết</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditBlog;