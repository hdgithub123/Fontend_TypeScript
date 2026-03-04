
import {postData } from "../../../utils/axios";
const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}

interface contentCheckResult {
  code?: boolean;
}



const checkCodeContentAvailability = async (
  { urlCheck = `${backendEndpoint}/template-contents/check`,
    code,
    id = null
  }: {
    urlCheck?: string,
    code: string,
    id?: string | null | undefined
  }): Promise<contentCheckResult> => {

  try {
    let myDataCheck;
    if (!id || id === "") {
      myDataCheck = {
        "fields": {
          "code": code,
        },
      }
    } else {
      myDataCheck = {
        "fields": {
          "id": id,
          "code": code,
        },
        "excludeField": "id"
      }
    }
    const res = await postData({
      url: urlCheck,
      data: myDataCheck,
    });
    return {
      code: res.data.code
    };
  } catch (err) {
    console.error("Error checking user:", err);
    return {};
  }
};

export default checkCodeContentAvailability;