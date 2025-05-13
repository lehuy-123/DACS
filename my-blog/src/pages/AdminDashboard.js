import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from '../components/SidebarAdmin';
import StatsCard from '../components/StatsCard';
import ChartBox from '../components/ChartBox';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalTags: 0,
    totalViews: 0,
    monthlyBlogs: []
  });

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.warn('⚠️ Không có token, chuyển hướng về trang đăng nhập...');
        return window.location.href = '/login';
      }

      try {
        const res = await axios.get('http://localhost:5001/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;

        setStats({
          totalUsers: data.totalUsers || 0,
          totalPosts: data.totalPosts || 0,
          totalTags: data.totalTags || 0,
          totalViews: data.totalViews || 0,
          monthlyBlogs: data.monthlyBlogs || []
        });

      } catch (error) {
        console.error('❌ Lỗi lấy dữ liệu thống kê:', error);
        if (error.response?.status === 403) {
          alert('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="admin-container">
      <SidebarAdmin />
      <div className="admin-content">
        <h1>📊 Bảng điều khiển quản trị</h1>

        <div className="card-grid">
          <StatsCard title="Người dùng" value={stats.totalUsers} color="#6c5ce7" />
          <StatsCard title="Bài viết" value={stats.totalPosts} color="#00cec9" />
          <StatsCard title="Tags" value={stats.totalTags} color="#fdcb6e" />
          <StatsCard title="Lượt xem" value={stats.totalViews} color="#d63031" />
        </div>

        <div className="chart-section">
          <h2 style={{ marginTop: '30px' }}>🗓️ Biểu đồ bài viết theo tháng</h2>
          <ChartBox data={stats.monthlyBlogs} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
