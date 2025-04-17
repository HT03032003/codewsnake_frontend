import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/admin/dashboard.css'; // CSS bạn vừa tạo

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data));
  }, []);

  const chartData = {
    labels: ['Tài khoản', 'Tài liệu', 'Bài tập', 'Bài đăng'],
    datasets: [
      {
        label: 'Tổng số lượng',
        data: stats ? [
          stats.total_users,
          stats.total_documents,
          stats.total_exercises,
          stats.total_posts
        ] : [],
        backgroundColor: [
          '#A8CABA',
          '#F8C8C4',
          '#FFD3B6',
          '#A0CED9'
        ],
        borderRadius: 8
      }
    ]
  };

  return (
    <Layout>
      <div className="content__header">
        <h2 className="admin-title">Quản lý Dashboard</h2>
      </div>

      {stats && (
        <>
          <div className="cards">
            <div className="card">
              <h3>Quản lý Tài Khoản</h3>
              <p>{stats.total_users} Người dùng</p>
            </div>
            <div className="card">
              <h3>Tài Liệu</h3>
              <p>{stats.total_documents} Tài liệu</p>
            </div>
            <div className="card">
              <h3>Bài Tập</h3>
              <p>{stats.total_exercises} Bài tập</p>
            </div>
            <div className="card">
              <h3>Bài Đăng</h3>
              <p>{stats.total_posts} Bài đăng</p>
            </div>
          </div>

          <div style={{ maxWidth: 600, margin: '40px auto' }}>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
