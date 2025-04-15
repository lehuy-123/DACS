import React from 'react';
import Navbar from './Navbar';
import '../styles/Header.css';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="header">
      <h1>Blog Của Tao</h1>
      {user && <span>Hello em gái, {user.name}</span>}
      <Navbar />
    </header>
  );
};

export default Header;