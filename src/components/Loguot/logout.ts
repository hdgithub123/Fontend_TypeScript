  import { getAuthHeaders, postData } from "../../utils/axios";
  
  const logout = async () => {
    const headers = getAuthHeaders();
    const result = await postData({ url: "http://localhost:3000/auth/logout", data: {}, headers: headers, isCookie: true });
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
  }

export default logout;