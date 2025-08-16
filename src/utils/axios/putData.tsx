import axios from 'axios';

interface UpdateDataParams {
  url: string;
  data: any;
  headers?: Record<string, any>;
  isCookie?: boolean;
  urlRefreshToken: string;
  redirect?: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

const putData = async ({
  url,
  data,
  headers = {},
  isCookie = false,
  urlRefreshToken='',
  redirect = '/login',
}: UpdateDataParams): Promise<ApiResponse> => {
  try {
    const response= await axios.put(url, data, {
      headers,
      withCredentials: isCookie,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const refreshResponse= await axios.post(urlRefreshToken, {}, {
          headers,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await axios.put(url, data, {
          headers: newHeaders,
          withCredentials: isCookie,
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.error('Lỗi khi làm mới token:', refreshError);
        window.location.href = redirect; // Redirect luôn
        return {
          status: false,
          message: 'Token hết hạn, vui lòng đăng nhập lại.',
        };
      }
    }else if (error.response) {
      // Lấy dữ liệu lỗi từ server (ví dụ: lỗi SQL, trùng ID, v.v.)
      return error.response;
    } else {
      console.error('Lỗi khi gửi dữ liệu:', error);
      return {
        status: false,
        message: 'Lỗi khi kết nối dữ liệu.',
      };
    }
  }
};

export default putData;
