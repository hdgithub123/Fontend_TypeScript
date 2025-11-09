  import { getAuthHeaders, postData } from "../../utils/axios";
  import { useDispatch } from 'react-redux';
  // import {logout as gotoLogout, persistor} from "../../app/store";


  const logout = async () => {
     const dispatch = useDispatch();
    const headers = getAuthHeaders();
    const result = await postData({ url: "http://localhost:3000/auth/logout", data: {}, headers: headers, isCookie: true });
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    if (result.status) {
      // dispatch(gotoLogout());
      // persistor.purge(); // Xóa dữ liệu đã được persist
      window.location.href = '/login';
    }
  }

export default logout;