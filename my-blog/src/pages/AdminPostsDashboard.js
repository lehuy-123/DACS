import React, { useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import AdminTabSwitcher from '../components/AdminTabSwitcher';
import PostTable from '../components/PostTable';
import ReviewTable from '../components/ReviewTable';
import CommentTable from '../components/CommentTable';
import '../styles/AdminPostsDashboard.css';

const AdminPostsDashboard = () => {
  const [tab, setTab] = useState('posts');

  return (
    <div className="admin-container">
      <SidebarAdmin />
      <div className="admin-content">
        <h1>📝 Quản lý nội dung</h1>
        <AdminTabSwitcher currentTab={tab} onTabChange={setTab} />
        <div className="tab-content">
          {tab === 'posts' && <PostTable />}
          {tab === 'review' && <ReviewTable />}
          {tab === 'comments' && <CommentTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminPostsDashboard;
