import axios from 'axios';

const updateData = async ({url, data, headers = {}, isCookie = false}) => {
  try {
    const response = await axios.put(url, data, {
      headers, // Truyền headers tùy chỉnh nếu có
      withCredentials: isCookie, // Nếu cần gửi cookie
    });
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
    return null; // Trả về null nếu có lỗi
  }
};

export default updateData;
