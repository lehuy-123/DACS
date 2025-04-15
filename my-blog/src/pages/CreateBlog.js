import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('public');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    formData.append('status', status);
    if (image) formData.append('image', image); // Đảm bảo gửi file ảnh

    try {
      const response = await axios.post('http://localhost:5001/api/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/my-blogs'); // Điều hướng về danh sách bài viết
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
    }
  };

  return (
    <div>
      <h2>Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nội dung:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ảnh đại diện:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <label>Tags (cách nhau bởi dấu phẩy):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label>Trạng thái:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="public">Công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
        <button type="submit">Tạo bài viết</button>
      </form>
    </div>
  );
};

export default CreateBlog;