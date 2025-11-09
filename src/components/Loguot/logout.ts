  import { getAuthHeaders, postData } from "../../utils/axios";
  import {persistor} from "../../app/store";


  const logout = async () => {
    const headers = getAuthHeaders();
    const result = await postData({ url: "http://localhost:3000/auth/logout", data: {}, headers: headers, isCookie: true });
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    if (result.status) {
      persistor.purge(); // Xóa dữ liệu đã được persist
      window.location.href = '/login';
    }
  }

export default logout;