import React, { useState } from 'react';
import '../styles/form.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
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
          <h1 className="form__title">Register</h1>

          <div className="form__content">
            <div className="form__box">
              <i className="ri-user-line form__icon"></i>
              <div className="form__box-input">
                <input
                  type="text"
                  id="form-username"
                  className="form__input"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="form-username" className="form__label">Username</label>
              </div>
            </div>

            <div className="form__box">
              <i className="ri-mail-line form__icon"></i>
              <div className="form__box-input">
                <input
                  type="email"
                  id="form-email"
                  className="form__input"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="form-email" className="form__label">Email</label>
              </div>
            </div>

            <div className="form__box">
              <i className="ri-lock-line form__icon"></i>
              <div className="form__box-input">
                <input
                  type="password"
                  id="form-pass"
                  className="form__input"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="form-pass" className="form__label">Password</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn">Register</button>

          <p className="form__footer">
            Already have an account? <a href="/login">Login</a>
          </p>

          {messages.length > 0 && messages.map((msg, index) => (
            <div key={index} className="alert alert-danger">{msg}</div>
          ))}
        </form>
      </div>
    </div>
  );
}

export default Register;
