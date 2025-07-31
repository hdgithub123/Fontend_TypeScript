// import axios from 'axios';


// const fetchData = async ({ url, headers = {}, isCookie = false, urlRefreshToken = '' }) => {
//     console.log("urlRefreshToken",urlRefreshToken)
//     try {
//         const response = await axios.get(url, {
//             headers, // Truyền headers tùy chỉnh
//             withCredentials: isCookie, // Cho phép gửi cookie
//         });
//         return response.data; // Trả về object JSON
//     } catch (error) {

//         if (error.response?.status === 401) {
//             console.log("error",error)
//             try {
//                 const response = await axios.post(urlRefreshToken, "", {
//                     headers, // Truyền headers tùy chỉnh nếu có
//                     withCredentials: true, // gui cookie refesh token
//                 });
//                 console.log("response.data.accessToken",response.data.accessToken)
//                 // gọi lại hàm fetchData với accessToken mới
//                 sessionStorage.setItem("token", response.data.accessToken);
//                 const newheaders = {
//                     ...headers,
//                     Authorization: `Bearer ${response.data.accessToken}`,
//                     // Thêm headers khác nếu cần
//                 };
//                 const retryResponse = await axios.get(url, { headers: newheaders, withCredentials: isCookie });
//                 return retryResponse.data; // Trả về dữ liệu phản hồi từ server
//             } catch (refreshError) {
//                 console.error("Lỗi khi làm mới token:", refreshError);
//                 return { status: false, message: "Token hết hạn, vui lòng đăng nhập lại." };
//             }
//         } else {
//             console.error('Lỗi khi lấy dữ liệu:', error);
//             return { status: false, message: "Lỗi khi kết nối dữ liệu." };
//         }

//     }
// };


// export default fetchData;

import axios from 'axios';

interface FetchDataParams {
  url: string;
  headers?: Record<string, string>;
  isCookie?: boolean;
  urlRefreshToken?: string;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  [key: string]: any;
}

const fetchData = async ({
  url,
  headers = {},
  isCookie = false,
  urlRefreshToken = '',
}: FetchDataParams): Promise<ApiResponse> => {
  try {
    const response = await axios.get(url, {
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

        const retryResponse = await axios.get(url, {
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

export default fetchData;
