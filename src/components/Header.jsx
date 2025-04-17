import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.user-info')) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showMenu]);

  if (loading) {
    return <header className="header">Loading...</header>;
  }

  return (
    <header className="header">
      <div className="header-container">
        <a href="/">
          <div className="logo-container">
            <img
              src={`${process.env.REACT_APP_API_URL}/media/logo/logo.png`}
              alt="CodewSnake Logo"
              className="logo"
              onError={(e) => (e.target.src = '/path/to/fallback-logo.png')} // Fallback image
            />
            <h2 className="logo-name">CodewSnake</h2>
          </div>
        </a>
        <nav className="space-x-4">
          <nav className="nav">
            <Link to="/" className="nav-button">Trang chủ</Link>
            <Link to="/document" className="nav-button">Tài liệu</Link>
            <Link to="/exercise" className="nav-button">Bài tập</Link>
            <Link to="/code-editor" className="nav-button">Coding</Link>
            <Link to="/community" className="nav-button">Cộng đồng</Link>
          </nav>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <div className="user-info">
              <img
                src={`${process.env.REACT_APP_API_URL}${user.profile.avatar}`}
                alt="User Avatar"
                className="avatar-header"
                onClick={toggleMenu}
              />
              {showMenu && (
                <div className="dropdown-menu">
                  <ul>
                    {user.user.is_superuser && (
                      <li><Link to="/admin">Trang admin</Link></li>
                    )}
                    <li><Link to="/profile">Thông tin cá nhân</Link></li>
                    <li><Link to="/settings">Cài đặt</Link></li>
                    <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"><button className="btn login-btn">Login</button></Link>
              <Link to="/register"><button className="btn signup-btn">Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
