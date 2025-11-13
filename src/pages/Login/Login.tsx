import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/userSlice';
import storage from 'redux-persist/lib/storage';

function Login() {
  const urlLogin = 'http://localhost:3000/auth/login';
  const urlRefreshToken = 'http://localhost:3000/auth/refresh-token';
  const [userLogin, setUserLogin] = useState({
    username: 'admin',
    password: 'admin',
    organization: 'ORG001'
  });

  const dispatch = useDispatch();
  // const userSystem = useSelector((state: any) => state.user);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLogin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await postData({ url: urlLogin, data: userLogin, isCookie: true, urlRefreshToken })
    if (result.status) {
      storage.removeItem('persist:header');
      dispatch(setUser({
        userName: result.data.code,
        fullName: result.data.name,
        image: result.data.image,
        organizationCode: result.data.organizationCode,
        organizationName: result.data.organizationName
      }));

      // lưu result.token vào localStorage
      localStorage.setItem('token', result.token);
      navigate('/select-department');
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
            value={userLogin.username}
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
            value={userLogin.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Mã tổ chức</label>
          <input
            type="text"
            name="organization"
            value={userLogin.organization}
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

