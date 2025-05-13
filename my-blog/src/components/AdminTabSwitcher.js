import React from 'react';
import '../styles/TabSwitcher.css';

const AdminTabSwitcher = ({ currentTab, onTabChange }) => {
  return (
    <div className="tab-switcher">
      <button
        className={currentTab === 'posts' ? 'active' : ''}
        onClick={() => onTabChange('posts')}
      >
        📄 Tất cả bài viết
      </button>
      <button
        className={currentTab === 'review' ? 'active' : ''}
        onClick={() => onTabChange('review')}
      >
        ⏳ Bài chờ duyệt
      </button>
      <button
        className={currentTab === 'comments' ? 'active' : ''}
        onClick={() => onTabChange('comments')}
      >
        💬 Bình luận
      </button>
    </div>
  );
};

export default AdminTabSwitcher;
