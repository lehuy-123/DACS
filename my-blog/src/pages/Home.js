import React from 'react';
import BlogList from '../components/BlogList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <main>
        <h1>Blog Của Tao</h1>
        <p>
          Chào mừng bạn đến với blog của tao! Đây là nơi mình chia sẻ những bài viết thú vị về âm nhạc, cuộc sống và nhiều chủ đề khác. Hãy khám phá nhé!
        </p>
        <h2>Blog mới nhất</h2>
        <BlogList />
      </main>
      <Footer />
    </div>
  );
};

export default Home;