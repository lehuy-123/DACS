import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '9803103319753326',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleFacebookLogin = () => {
    setLoading(true);
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          window.FB.api(
            '/me',
            { fields: 'id,name,email' },
            (userResponse) => {
              if (userResponse && !userResponse.error) {
                const user = {
                  _id: userResponse.id,
                  name: userResponse.name,
                  email: userResponse.email || `${userResponse.id}@facebook.com`,
                  token: accessToken
                };
                localStorage.setItem('user', JSON.stringify(user));
                alert('✅ Đăng nhập Facebook thành công!');
                navigate('/');
              } else {
                console.error('❌ Lỗi lấy thông tin:', userResponse.error);
                alert('Lỗi khi lấy thông tin Facebook');
              }
              setLoading(false);
            }
          );
        } else {
          alert('Bạn đã hủy đăng nhập.');
          setLoading(false);
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Đăng nhập thành công!');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      console.error('Lỗi:', err);
      alert('Đã xảy ra lỗi.');
    }
  };

  return (
    <div className="login">
      <Header />
      <main>
        <div className="login-card">
          <h2>Đăng nhập</h2>
          <button onClick={handleFacebookLogin} disabled={loading} className="social-login-btn">
            <span className="facebook-icon">📘</span>
            {loading ? 'Đang xử lý...' : 'Đăng nhập với Facebook'}
          </button>

          <div style={{ marginTop: '25px', width: '100%' }}>
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="normal-btn">
                Đăng nhập thường
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
