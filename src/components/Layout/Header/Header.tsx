import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  console.log('Header user:', user);
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{
      background: '#ddd',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h3>🔝 Header</h3>
      {user.fullName !== '' ? (<div>
        <span>Welcome, {user.fullName}</span>
        <span> {user.organizationName}</span>
      </div>

      ) : (
        <button
          onClick={handleLoginClick}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Đăng nhập
        </button>)}
    </div>
  );
}

export default Header;