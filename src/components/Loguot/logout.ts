  import {  postData } from "../../utils/axios";
  import {persistor} from "../../redux/store";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

  const logout = async () => {

    const result = await postData({ url: `${backendEndpoint}/auth/logout`, data: {}, isCookie: true });
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    if (result.status) {
      persistor.purge(); // Xóa dữ liệu đã được persist
      window.location.href = '/login';
    }
  }

export default logout;