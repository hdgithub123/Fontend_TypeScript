
import type { TranslateMessageMap } from './dataType';
export const messagesVi : TranslateMessageMap = {
  required: "bắt buộc phải nhập",
  format: "phải đúng định dạng {format}",
  type: "phải có kiểu dữ liệu là {type}",
  min: "giá trị phải lớn hơn {min}",
  max: "giá trị phải nhỏ hơn {max}",
  minLength: "cần tối thiểu {minLength} ký tự",
  maxLength: "không được vượt quá {maxLength} ký tự",
  enum: "phải là một trong các giá trị: {values}",
  regex: "phải đúng với biểu thức quy định",
  hasUpperCase: "cần có ít nhất một chữ in hoa",
  hasLowerCase: "cần có ít nhất một chữ thường",
  hasNumber: "cần chứa ít nhất một chữ số",
  hasSpecialChar: "cần có ít nhất một ký tự đặc biệt",
  noCheckXSS: "không được chứa nội dung HTML hoặc mã nguy hiểm",
  custom: "không đạt kiểm tra tùy chỉnh"
};

export const messagesEn :TranslateMessageMap = {
  required: "{label} is required.",
  format: "{label} must match the {format} format.",
  type: "{label} must be of type {type}.",
  min: "{label} must be less than {min}",
  max: "{label} must not exceed {max}.",
  minLength: "{label} must be at least {minLength} characters long.",
  maxLength: "{label} must not exceed {maxLength} characters.",
  enum: "{label} must be one of the following values: {values}.",
  regex: "{label} must match the required pattern.",
  hasUpperCase: "{label} must contain at least one uppercase letter.",
  hasLowerCase: "{label} must contain at least one lowercase letter.",
  hasNumber: "{label} must include at least one number.",
  hasSpecialChar: "{label} must contain at least one special character.",
  noCheckXSS: "{label} must not include HTML content or malicious code.",
  custom: "{label} failed the custom validation."
};