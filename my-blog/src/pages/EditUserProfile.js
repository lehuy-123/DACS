import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/EditUserProfile.css';
import api from '../api/api';

const EditUserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/1');
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
        setBio(user.bio);
        setAvatarPreview(user.avatar);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    try {
      await api.put('/users/1', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Cập nhật thông tin thành công!');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Cập nhật thông tin thất bại.');
    }
  };

  return (
    <div className="edit-user-profile">
      <Header />
      <main>
        <h2>Chỉnh sửa hồ sơ</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Giới thiệu bản thân"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatarPreview && <img src={avatarPreview} alt="Preview" className="preview-image" />}
          <button type="submit">Cập nhật</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditUserProfile;