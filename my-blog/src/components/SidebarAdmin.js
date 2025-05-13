import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SidebarAdmin.css';

const SidebarAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-admin">
      <h2 className="logo">🔧 Admin</h2>
      <ul>
        <li onClick={() => navigate('/admin')}>📊 Dashboard</li>
        <li onClick={() => navigate('/admin/users')}>👥 Người dùng</li>
        <li onClick={() => navigate('/admin/posts')}>📝 Bài viết</li>
        <li onClick={() => navigate('/admin/tags')}>🏷️ Tags</li>
        <li onClick={() => navigate('/')}>⬅️ Quay lại Blog</li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
