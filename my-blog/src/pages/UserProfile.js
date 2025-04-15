import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/UserProfile.css';
import api from '../api/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/1'); // Giả định ID người dùng là 1
        setUser(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="user-profile">
      <Header />
      <main>
        <h2>Hồ sơ người dùng</h2>
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h3>{user.name}</h3>
        <p>Email: {user.email}</p>
        <p>Giới thiệu: {user.bio}</p>
        <Link to="/edit-profile">Chỉnh sửa hồ sơ</Link>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;