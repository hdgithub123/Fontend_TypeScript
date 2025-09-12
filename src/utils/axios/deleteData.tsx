import axios from 'axios';
import getAuthHeaders from './getAuthHeaders';
import urlRefreshTokenDefault from './urlRefeshToken';

interface DeleteDataParams {
  url: string;
  headers?: Record<string, any>;
  isCookie?: boolean;
  urlRefreshToken?: string;
  data?: Record<string, any>;
  redirect?: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any; // Cho phép mở rộng với các key tùy ý
}

const deleteData = async ({
  url,
  headers = getAuthHeaders() ?? {},
  isCookie = false,
  urlRefreshToken = urlRefreshTokenDefault ? urlRefreshTokenDefault : '',
  data = {},
  redirect = '/login',
}: DeleteDataParams): Promise<ApiResponse | null> => {

  try {
    const response = await axios.delete(url, {
      headers,
      withCredentials: isCookie,
      data
    });
    return response.data ? response.data : { status: true, message: 'Xóa thành công' };
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(urlRefreshToken, {}, {
          headers,
          withCredentials: true,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        const newHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await axios.delete(url, {
          headers: newHeaders,
          withCredentials: isCookie,
          data
        });
        return retryResponse.data ?? { status: true, message: 'Xóa thành công' };
      } catch (refreshError: any) {
        const refreshErr: any = refreshError;
        console.error('Lỗi khi làm mới token:', refreshErr);

        const statusCode = refreshErr.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          window.location.href = redirect;
        }
        return refreshErr?.response.data ?? { status: true, message: 'Xóa thành công' };
      }
    } else {
      console.error('Lỗi khi lấy dữ liệu:', error);
      return error.response?.data ? error.response.data : { status: false, message: 'Có lỗi xảy ra khi xóa dữ liệu.' };
    }
  }
};

export default deleteData;
