
import { getAuthHeaders, postData } from "../../../utils/axios";

interface user {
  id?: string | null | undefined;
  code?: string;
  password?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  image?: string;
  isActive?: boolean | string | number; // Allow boolean, string, or number
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserCheckResult {
  code?: boolean;
  email?: boolean;
}



const checkUserAvailability = async (
  { urlCheckUser = 'http://localhost:3000/auth/user/check-user',
    urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
    user = {}
  }: {
    urlCheckUser?: string,
    urlRefreshToken?: string,
    user: user,
  }): Promise<UserCheckResult> => {

  const headers = getAuthHeaders();
  try {
    const fields: { [key: string]: any } = {};
    for (const key in user) {
      if (user[key] !== undefined) {
        fields[key] = user[key];
      }
    }

    let myUserCheck;
    if (!user.id || user.id === "") {
      myUserCheck = { fields };
    } else {
      myUserCheck = { fields, excludeField: "id" };
    }

    const res = await postData({
      url: urlCheckUser,
      data: myUserCheck,
      headers,
      urlRefreshToken,
      isCookie: false
    });

    const result: { [key: string]: boolean } = {};
    for (const key in fields) {
      result[key] = res.data[key];
    }
    return result
  } catch (err) {
    console.error("Error checking user:", err);
    return {};
  }
};

export default checkUserAvailability;