// import axios from 'axios';

// const postData = async ({url, data, headers = {}, isCookie = false,urlRefreshToken=''}) => {
//   try {
//     const response = await axios.post(url, data, {
//       headers, // Truyền headers tùy chỉnh nếu có
//       withCredentials: isCookie, // Nếu cần gửi cookie
//     });
//     return response.data; // Trả về dữ liệu phản hồi từ server
//   } catch (error) {
//         if (error.response?.status === 401) {
//             try {
//                 const response = await axios.post(urlRefreshToken, "", {
//                     headers, // Truyền headers tùy chỉnh nếu có
//                     withCredentials: true, // gui cookie refesh token
//                 });
//                 // gọi lại hàm fetchData với accessToken mới
//                 sessionStorage.setItem("token", response.data.accessToken);
//                 const newheaders = {
//                     ...headers,
//                     Authorization: `Bearer ${response.data.accessToken}`,
//                     // Thêm headers khác nếu cần
//                 };
//                 const retryResponse = await axios.post(url,data, { headers: newheaders, withCredentials: isCookie });
//                 return retryResponse.data; // Trả về dữ liệu phản hồi từ server
//             } catch (refreshError) {
//                 console.error("Lỗi khi làm mới token:", refreshError);
//                 return { status: false, message: "Token hết hạn, vui lòng đăng nhập lại." };
//             }
//         } else {
//             console.error('Lỗi khi lấy dữ liệu:', error);
//             return { status: false, message: "Lỗi khi kết nối dữ liệu." };
//         }
//   }
// };

// export default postData;


import axios from 'axios';

interface PostDataParams {
  url: string;
  data: any;
  headers?: Record<string, string>;
  isCookie?: boolean;
  urlRefreshToken?: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

const postData = async ({
  url,
  data,
  headers = {},
  isCookie = false,
  urlRefreshToken = '',
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

        const retryResponse = await axios.post(url, data, {
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
      console.error('Lỗi khi gửi dữ liệu:', error);
      return {
        status: false,
        message: 'Lỗi khi kết nối dữ liệu.',
      };
    }
  }
};

export default postData;
