import logout from "../../components/Loguot/logout";
import { useNavigate } from 'react-router-dom';

function Loguot() {
  const navigate = useNavigate();
  logout();

  const handleNavigateHome = () => {
    navigate('/');
  }

  return (
    <div>
      Logout
      <button onClick={handleNavigateHome}>Chuyển về trang chủ</button>
    </div>
  );
}

export default Loguot;