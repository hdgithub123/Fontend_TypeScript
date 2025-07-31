import axios from 'axios';

interface DeleteDataParams {
  url: string;
  headers?: Record<string, string>;
  isCookie?: boolean;
  urlRefreshToken: string,
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any; // Cho phép mở rộng với các key tùy ý
}

const deleteData = async ({
  url,
  headers = {},
  isCookie = false,
  urlRefreshToken = '',
}: DeleteDataParams): Promise<ApiResponse | null> => {
  try {
    const response = await axios.delete(url, {
      headers,
      withCredentials: isCookie,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(urlRefreshToken, '', {
          headers,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        sessionStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await axios.delete(url, {
          headers: newHeaders,
          withCredentials: isCookie,
        });

        return retryResponse.data;
      } catch (refreshError: any) {
        console.error('Lỗi khi làm mới token:', refreshError);
        return {
          status: false,
          message: 'Token hết hạn, vui lòng đăng nhập lại.',
        };
      }
    } else {
      console.error('Lỗi khi lấy dữ liệu:', error);
      return {
        status: false,
        message: 'Lỗi khi kết nối dữ liệu.',
      };
    }
  }
};

export default deleteData;
