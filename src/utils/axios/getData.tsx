import axios, { AxiosError, type AxiosResponse } from 'axios';



interface FetchDataParams {
  url: string;
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

const getData = async ({
  url,
  headers = {},
  isCookie = false,
  urlRefreshToken = '',
  redirect = '/login',
}: FetchDataParams): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(url, {
      headers,
      withCredentials: isCookie,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    if (err.response?.status === 401 && urlRefreshToken) {
      try {
        const refreshResponse: AxiosResponse<{ accessToken: string }> = await axios.post(
          urlRefreshToken,
          {},
          {
            headers,
            withCredentials: true,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse: AxiosResponse<ApiResponse> = await axios.get(url, {
          headers: newHeaders,
          withCredentials: isCookie,
        });

        return retryResponse.data;
      } catch (refreshError) {
        const refreshErr = refreshError as AxiosError;
        console.error('Lỗi khi làm mới token:', refreshErr.message);
        window.location.href = redirect; // Redirect luôn
        return {
          status: false,
          message: 'Token hết hạn, vui lòng đăng nhập lại.',
        };
      }
    }

    console.error('Lỗi khi lấy dữ liệu:', err.message);
    return {
      status: false,
      message: 'Lỗi khi kết nối dữ liệu.',
    };
  }
};

export default getData;
