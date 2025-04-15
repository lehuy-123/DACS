import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    setLoading(true);
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Gọi Facebook Graph API để lấy thông tin người dùng
          window.FB.api(
            '/me',
            { fields: 'id,name,email' },
            (userResponse) => {
              if (userResponse && !userResponse.error) {
                // Lưu thông tin người dùng vào localStorage
                const user = {
                  id: userResponse.id,
                  name: userResponse.name,
                  email: userResponse.email,
                };
                localStorage.setItem('user', JSON.stringify(user));
                alert('Đăng nhập thành công!');
                navigate('/');
              } else {
                console.error('Lỗi lấy thông tin người dùng:', userResponse.error);
                alert('Đăng nhập thất bại. Vui lòng thử lại.');
              }
              setLoading(false);
            }
          );
        } else {
          console.log('Đăng nhập thất bại');
          alert('Bạn đã hủy đăng nhập.');
          setLoading(false);
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <div className="login">
      <Header />
      <main>
        <h2>Đăng nhập</h2>
        <button onClick={handleFacebookLogin} disabled={loading}>
          <span className="facebook-icon">📘</span>{' '}
          {loading ? 'Đang xử lý...' : 'Đăng nhập với Facebook'}
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Login;