import axios from 'axios';
import getAuthHeaders from './getAuthHeaders';
import urlRefreshTokenDefault from './urlRefeshToken';

interface PostDataParams {
  url: string;
  data: any;
  headers?: Record<string, any>;
  isCookie?: boolean;
  urlRefreshToken?: string;
  redirect?: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

const postData = async ({
  url,
  data,
  headers = getAuthHeaders() ?? {},
  isCookie = false,
  urlRefreshToken = urlRefreshTokenDefault ? urlRefreshTokenDefault : '',
  redirect = '/login',
}: PostDataParams): Promise<ApiResponse> => {

  try {
    const response = await axios.post(url, data, {
      headers,
      withCredentials: isCookie,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(urlRefreshToken, {}, {
          headers: headers,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await axios.post(url, data, {
          headers: newHeaders,
          withCredentials: isCookie,
        });
        return retryResponse.data;
      } catch (refreshError: any) {

        const refreshErr = refreshError;
        console.error('Lỗi khi làm mới token:', refreshErr.message);

        const statusCode = refreshErr.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          window.location.href = redirect;
        }

        return {
          status: false,
          message: 'Token hết hạn, vui lòng đăng nhập lại.',
        };
      }
    } else if (error.response) {
      // Lấy dữ liệu lỗi từ server (ví dụ: lỗi SQL, trùng ID, v.v.)
      return error.response.data;
    } else {
      console.error('Lỗi khi gửi dữ liệu:', error);
      return {
        status: false,
        message: 'Lỗi khi kết nối dữ liệu.',
      };
    }
  }
};

export default postData;
