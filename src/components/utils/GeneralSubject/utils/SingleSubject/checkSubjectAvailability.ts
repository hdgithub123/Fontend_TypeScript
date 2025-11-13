
import { postData } from "../../../../../utils/axios";

interface subject {
  id?: string | null | undefined;
  code?: string;
  [key: string]: string | boolean | string | number; // Allow any additional fields
}



interface subjectCheckResult {
  [key: string]: boolean;
}



const checkSubjectAvailability = async (
  { urlCheck = null,
    subject = {}
  }: {
    urlCheck?: string | null,
    subject: subject,
  }): Promise<subjectCheckResult> => {

  try {
    const fields: { [key: string]: any } = {};
    for (const key in subject) {
      if (subject[key] !== undefined) {
        fields[key] = subject[key];
      }
    }

    let mySubjectCheck;
    if (!subject.id || subject.id === "") {
      mySubjectCheck = { fields };
    } else {
      mySubjectCheck = { fields, excludeField: "id" };
    }

    const res = await postData({
      url: urlCheck,
      data: mySubjectCheck,
    });

    const result: { [key: string]: boolean } = {};
    for (const key in fields) {
      result[key] = res.data[key];
    }
    return result
  } catch (err) {
    console.error("Error checking organization:", err);
    return {};
  }
};

export default checkSubjectAvailability;