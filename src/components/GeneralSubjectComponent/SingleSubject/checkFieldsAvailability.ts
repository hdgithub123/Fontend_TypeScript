import checkSubjectAvailability from "./checkSubjectAvailability";

export default async function checkFieldsAvailability({
  data,
  urlCheck,
  fieldExists = [],
  fieldNoExists = [],
  idField = "id"
}: {
  data: Record<string, any>,
  urlCheck: string,
  fieldExists?: string[],
  fieldNoExists?: string[],
  idField?: string
}) {
  const errors: Record<string, string> = {};

  // Kiểm tra tồn tại
  if (fieldExists.length > 0) {
    const checkObj: Record<string, any> = {};
    for (const field of fieldExists) {
      if (data[field] !== undefined) checkObj[field] = data[field];
    }
    checkObj[idField] = data[idField];
    const result = await checkSubjectAvailability({ urlCheck, subject: checkObj });
    for (const field of fieldExists) {
      if (result[field]) errors[field] = "Thông tin đã tồn tại";
    }
  }

  // Kiểm tra không tồn tại
  if (fieldNoExists.length > 0) {
    const checkObj: Record<string, any> = {};
    for (const field of fieldNoExists) {
      if (data[field] !== undefined) checkObj[field] = data[field];
    }
    checkObj[idField] = data[idField];
    const result = await checkSubjectAvailability({ urlCheck, subject: checkObj });
    for (const field of fieldNoExists) {
      if (!result[field]) errors[field] = "Thông tin không tồn tại";
    }
  }

  return errors;
}