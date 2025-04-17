import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import '../../styles/admin/layout-admin.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const fetchUser = () => {
    const token = localStorage.getItem('accessToken');

    axios
      .get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">DASHBOARD</h2>
        <ul className="admin-menu">
          <li className={location.pathname === "/admin" ? "active" : ""}>
            <Link to="/admin">Trang chủ</Link>
          </li>
          <li className={location.pathname.startsWith("/admin/accounts") ? "active" : ""}>
            <Link to="/admin/accounts">Quản lý tài khoản</Link>
          </li>
          <li className={location.pathname.startsWith("/admin/documents") ? "active" : ""}>
            <Link to="/admin/documents">Tài liệu</Link>
          </li>
          <li className={location.pathname.startsWith("/admin/exercises") ? "active" : ""}>
            <Link to="/admin/exercises">Bài tập</Link>
          </li>
          <li className={location.pathname.startsWith("/admin/posts") ? "active" : ""}>
            <Link to="/admin/posts">Bài đăng</Link>
          </li>
        </ul>
      </div>

      {/* Nội dung chính */}
      <main className="admin-content">
        {user && (
          <div className="admin-info">
          <div className="admin-box">
            <img src={`${process.env.REACT_APP_API_URL}${user.profile.avatar}`} alt="Avatar" className="admin-avatar" />
            <span className="admin-name">{user.user.username}</span>
          </div>
          <div className="admin-home">
            <Link to="/" className="home-link">Quay về trang chủ</Link>
          </div>
        </div>        
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
