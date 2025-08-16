import RegistrationForm from '../../components/User/SingleUser/RegistrationForm/RegistrationForm';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleonRegisterSuccess = (userData: any) => {
    // Handle successful registration
    console.log("Registration successful:", userData);
    // Navigate to the desired page after successful registration
    navigate("/");
  };

  return (
    <div>
    <RegistrationForm
    onRegisterSuccess = {handleonRegisterSuccess}
    
    ></RegistrationForm>
    </div>
  );
}

export default Register;