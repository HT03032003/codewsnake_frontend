import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [messages, setMessages] = useState([]); // Placeholder for messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]); // Reset messages

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // alert(data.message); // Đăng nhập thành công
        // console.log('Access Token:', data.access);
        // console.log('Refresh Token:', data.refresh);
        // console.log('userId', data.userId);
        // console.log('username', data.username);

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        // localStorage.setItem('userId', data.userId)
        // localStorage.setItem('username', data.username);

        // Điều hướng đến trang chính (nếu cần)
        if (data.isAdmin) {
          // Nếu là admin, chuyển tới trang admin
          navigate('/admin');
        } else {
          // Nếu không phải admin, chuyển tới trang chính
          navigate('/');
        }
      } else {
        // Thêm thông báo lỗi
        setMessages([data.error]);
      }
    } catch (error) {
      setMessages(['An unexpected error occurred. Please try again later.']);
    }
  };


  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form__form">
          <h1 className="form__title">Login</h1>

          <div className="form__content">
            <div className="form__box">
              <i className="ri-user-3-line form__icon"></i>

              <div className="form__box-input">
                <input
                  type="email"
                  required
                  className="form__input"
                  id="form-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="form-email" className="form__label">Email</label>
              </div>
            </div>

            <div className="form__box">
              <i className="ri-lock-2-line form__icon"></i>

              <div className="form__box-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form__input"
                  id="form-pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="form-pass" className="form__label">Password</label>
                <i
                  className={`ri-eye${showPassword ? '-line' : '-off-line'} form__eye`}
                  id="form-eye"
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
          </div>

          <div className="form__check">
            <div className="form__check-group">
              <input
                type="checkbox"
                className="form__check-input"
                id="form-check"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="form-check" className="form__check-label">Remember me</label>
            </div>

            <a href="#" className="form__forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="btn">Login</button>

          <p className="form__footer">
            Don't have an account? <a href="/register">Register</a>
          </p>

          {messages.length > 0 && (
            messages.map((message, index) => (
              <div key={index} className="alert alert-danger">{message}</div>
            ))
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
