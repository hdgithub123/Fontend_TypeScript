
import { getAuthHeaders, postData } from "../../../utils/axios";

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
  { urlCheck = 'http://localhost:3000/template-contents/check',
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