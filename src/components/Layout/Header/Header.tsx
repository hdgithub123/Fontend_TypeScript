// function Header() {
//   return (
//     <div style={{ background: '#ddd', padding: '1rem' }}>
//       <h3>🔝 Header</h3>
//     </div>
//   );
// }

// export default Header;


import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

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
      <button 
        onClick={handleLoginClick} 
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Đăng nhập
      </button>
    </div>
  );
}

export default Header;