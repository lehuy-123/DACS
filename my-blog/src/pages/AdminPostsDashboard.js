import React, { useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import AdminTabSwitcher from '../components/AdminTabSwitcher';
import PostTable from './PostTable';
import ReviewTable from '../components/ReviewTable';
import CommentTable from '../components/CommentTable';
import '../styles/AdminPostsDashboard.css';

const AdminPostsDashboard = () => {
  const [tab, setTab] = useState('posts');

  const renderTabContent = () => {
    switch (tab) {
      case 'posts':
        return <PostTable />;
      case 'review':
        return <ReviewTable />;
      case 'comments':
        return <CommentTable />;
      default:
        return <p>Không tìm thấy tab phù hợp</p>;
    }
  };

  return (
    <div className="admin-container">
      <SidebarAdmin />

      <div className="admin-content">
        <h1 className="dashboard-title">📝 Quản lý nội dung</h1>
        <AdminTabSwitcher currentTab={tab} onTabChange={setTab} />

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPostsDashboard;
