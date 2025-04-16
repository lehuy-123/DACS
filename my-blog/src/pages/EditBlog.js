import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditBlog.css';
import { useParams } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('public');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/blogs/${id}`);
        const blog = response.data.data;
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags || '');
        setStatus(blog.status || 'public');
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);
    formData.append('tags', tags);
    formData.append('status', status);

    try {
      await axios.put(`http://localhost:5001/api/blogs/${id}`, {
        title,
        content,
        image: image ? `/uploads/${image.name}` : '',
        tags,
        status
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="edit-blog-container">
      <div className="edit-blog-content">
        <h2>Chỉnh sửa bài viết</h2>
        <form className="edit-blog-form" onSubmit={handleSubmit}>
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
          <button type="submit">Cập nhật bài viết</button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;