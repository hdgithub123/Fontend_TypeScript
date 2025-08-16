import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData,getAuthHeaders } from '../../utils/axios';

function Login() {
  const urlLogin = 'http://localhost:3000/auth/login';
  const urlRefreshToken = 'http://localhost:3000/auth/refresh-token';
  const [user, setUser] = useState({
    username: 'admin',
    password: 'admin'
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await postData({ url: urlLogin, data: user, headers: getAuthHeaders(), isCookie: true, urlRefreshToken })
    if (result.status) {
      // lưu result.token vào localStorage
      localStorage.setItem('token', result.token);
       navigate('/');
    } else {
       alert('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          width: '300px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🔐 Đăng nhập</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default Login;

