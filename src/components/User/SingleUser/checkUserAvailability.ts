
  import { getAuthHeaders, postData } from "../../../utils/axios";
  
  interface User {
    id: string;
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
  }
  
  interface UserCheckResult {
    username?: boolean;
    email?: boolean;
  }
  


  const checkUserAvailability = async (
    {urlCheckUser = 'http://localhost:3000/auth/user/check-user',
    urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
    username,
    email,
    id
  }: {
    urlCheckUser?: string,
    urlRefreshToken?: string,
    username: string,
    email: string,
    id: string | null | undefined
  }): Promise<UserCheckResult> => {

    const headers = getAuthHeaders();
    try {
      let myUserCheck;
      if (!id || id === "") {
        myUserCheck = {
          "fields": {
            "username": username,
            "email": email
          },
        }
      } else {
        myUserCheck = {
          "fields": {
            "id": id,
            "username": username,
            "email": email
          },
          "excludeField": "id"
        }
      }
      const res = await postData({
        url: urlCheckUser,
        data: myUserCheck,
        headers,
        urlRefreshToken,
        isCookie: false
      });
      return {
        username: res.data.username,
        email: res.data.email
      };
    } catch (err) {
      console.error("Error checking user:", err);
      return {};
    }
  };

  export default checkUserAvailability;