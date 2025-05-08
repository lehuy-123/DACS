



import React, { useState } from 'react';
import '../styles/CreateBlog.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // ✅ Hỗ trợ upload NHIỀU ảnh cùng lúc
  const handleUploadContentImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImages(true);

    for (let file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await axios.post('http://localhost:5001/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const imageUrl = res.data.url;
        setContent(prev => `${prev}\n\n![Mô tả ảnh](${imageUrl})\n\n`);
      } catch (err) {
        console.error('Lỗi upload ảnh:', err);
        alert(`Upload ảnh thất bại: ${file.name}`);
      }
    }
    alert('Đã tải và chèn xong ảnh vào nội dung!');
    setUploadingImages(false);
  };

  return (
    <div className="create-blog-page">
      <Header />
      <main className="create-blog-container">
        <div className="create-blog-wrapper">
          <h2 className="create-blog-title">Tạo bài viết mới</h2>
          <form onSubmit={handleSubmit} className="create-blog-form">
            <div className="form-group">
              <label htmlFor="title">Tiêu đề chính:</label>
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
              <label htmlFor="image">Hình ảnh (banner chính):</label>
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
              <label htmlFor="content">Nội dung (Markdown):</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết nội dung bài viết của bạn (hỗ trợ Markdown)..."
                rows="10"
                required
              />
              <div style={{ marginTop: '10px' }}>
                <label>
                  <strong>Chèn ảnh vào nội dung (có thể chọn nhiều ảnh):</strong>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadContentImages}
                  disabled={uploadingImages}
                />
                {uploadingImages && <p style={{ color: 'blue' }}>Đang tải ảnh lên...</p>}
              </div>
            </div>
            <div className="form-group">
              <label>Xem trước nội dung:</label>
              <div className="markdown-preview" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', background: '#fafafa' }}>
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p><i>Nội dung xem trước sẽ xuất hiện ở đây...</i></p>
                )}
              </div>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlog;
