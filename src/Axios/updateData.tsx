import axios, { AxiosError, AxiosResponse } from 'axios';

interface UpdateDataParams {
  url: string;
  data: any;
  headers?: Record<string, string>;
  isCookie?: boolean;
  urlRefreshToken: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

const updateData = async ({
  url,
  data,
  headers = {},
  isCookie = false,
  urlRefreshToken='',
}: UpdateDataParams): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.put(url, data, {
      headers,
      withCredentials: isCookie,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status === 401) {
      try {
        const refreshResponse: AxiosResponse<{ accessToken: string }> = await axios.post(urlRefreshToken, '', {
          headers,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        sessionStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse: AxiosResponse<ApiResponse> = await axios.put(url, data, {
          headers: newHeaders,
          withCredentials: isCookie,
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.error('Lỗi khi làm mới token:', refreshError);
        return {
          status: false,
          message: 'Token hết hạn, vui lòng đăng nhập lại.',
        };
      }
    }

    console.error('Lỗi khi gửi dữ liệu:', error);
    return {
      status: false,
      message: 'Lỗi khi kết nối dữ liệu.',
    };
  }
};

export default updateData;
