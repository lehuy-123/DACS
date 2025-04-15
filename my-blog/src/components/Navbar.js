import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Trang chủ</Link>
        <Link to="/my-blogs" onClick={() => setIsOpen(false)}>Bài viết của tôi</Link>
        <Link to="/create-blog" onClick={() => setIsOpen(false)}>Tạo bài viết</Link>
        <Link to="/profile" onClick={() => setIsOpen(false)}>Hồ sơ</Link>
        {user ? (
          <button onClick={handleLogout}>Đăng xuất</button>
        ) : (
          <Link to="/login" onClick={() => setIsOpen(false)}>Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;