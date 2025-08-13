import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./RegistrationForm.module.scss";
import { validateDataArray, messagesVi } from "../../../validation";
import type { RuleSchema } from "../../../validation";
import { postData } from "../../../Axios";

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

interface RegistrationFormProps {
  urlCheckUser?: string;
  urlInsertUser?: string;
  urlRefreshToken?: string;
  zoneId?: string;
  onRegisterSuccess: () => void
}

const registrationSchema: RuleSchema = {
  username: { type: "string", required: true, min: 6, max: 20, regex: "^[a-zA-Z0-9_]+$" },
  password: { type: "string", required: true, min: 8, max: 30 },
  fullName: { type: "string", required: true, min: 2, max: 50 },
  email: { type: "string", required: true, format: "email" },
  phone: { type: "string", required: false, format: "phone" }
};


const fields: Record<string, string> = {
  username: "Tên đăng nhập",
  password: "Mật khẩu",
  fullName: "Họ và tên",
  email: "Email",
  phone: "Điện thoại"
};


export default function RegistrationForm({
  urlCheckUser = 'http://localhost:3000/auth/user/check-user',
  urlInsertUser = 'http://localhost:3000/auth/user/detail/insert',
  urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
  zoneId = '8e522402-3611-11f0-b432-0242ac110002',
  onRegisterSuccess,
}: RegistrationFormProps) {
  const [userData, setUserData] = useState<User>({
    id: "",
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const checkUserAvailability = async (username: string, email: string): Promise<UserCheckResult> => {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${token}`,
      zone: zoneId,
      is_child_zone: true
    };
    try {

      const myUserCheck = {
        "fields": {
          "username": username,
          "email": email
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

  // debounce check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userData.username || userData.email) {
        const result = await checkUserAvailability(userData.username, userData.email);
        const newErrors: Partial<User> = {};
        if (result.username) newErrors.username = "Tên đăng nhập đã tồn tại";
        if (result.email) newErrors.email = "Email đã tồn tại";
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [userData.username, userData.email]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Cập nhật state userData
    setUserData((prev) => ({ ...prev, [name]: value }));

    // Validate ngay field vừa thay đổi
    const singleFieldData = { [name]: value };
    const result = validateDataArray([singleFieldData], registrationSchema, messagesVi);

    if (!result.status) {
      // Nếu có lỗi thì set lỗi cho field này
      setErrors((prev) => ({
        ...prev,
        [name]: result.results[0]?.errors?.[name] || ""
      }));
    } else {
      // Nếu không lỗi thì xóa lỗi field này
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const validateForm = () => {
    const result = validateDataArray([userData], registrationSchema, messagesVi);
    if (!result.status) {
      setErrors(result.results[0]?.errors || {});
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // check trùng
      const checkResult = await checkUserAvailability(userData.username, userData.email);
      const checkErrors: Partial<User> = {};
      if (checkResult.username) checkErrors.username = "Tên đăng nhập đã tồn tại";
      if (checkResult.email) checkErrors.email = "Email đã tồn tại";
      if (Object.keys(checkErrors).length > 0) {
        setErrors(checkErrors);
        return;
      }

      // validate dữ liệu
      if (!validateForm()) return;

      // insert user
      const token = sessionStorage.getItem("token");
      const headers = {
        // "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${token}`,
        zone: zoneId,
        is_child_zone: true
      };

      const insertUser = {
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        isActive: true,
        createdBy: "admin"
      };

      const formData = new URLSearchParams();
      Object.entries(insertUser).forEach(([k, v]) => formData.append(k, String(v ?? "")));

      const result = await postData({
        url: urlInsertUser,
        data: insertUser,
        headers,
        urlRefreshToken,
        isCookie: true
      });

      if (result.status === true) {
        onRegisterSuccess(true)
      }

      setUserData({ id: "", username: "", password: "", fullName: "", email: "", phone: "" });
      setErrors({});
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        username: "Có lỗi xảy ra khi đăng ký",
        email: "Có lỗi xảy ra khi đăng ký"
      });
    }
  };

  // Xem còn lỗi hay không (để đổi style/hiển thị thông báo)
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        {Object.entries(fields).map(([field, label]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            <input
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                    ? "email"
                    : "text"
              }
              id={field}
              name={field}
              value={userData[field as keyof User]}
              onChange={handleChange}
              placeholder={`Nhập ${label}`}
              className={errors[field as keyof User] ? styles.errorInput : ""}
            />
            {errors[field as keyof User] && (
              <span className={styles.error}>
                {errors[field as keyof User]}
              </span>
            )}
          </div>
        ))}
        <button
          type="submit"
          className={`${styles.submitBtn} ${(hasErrors) ? styles.disabled : ""}`}
          disabled={hasErrors ? true : false}
        >
          {hasErrors ? "Pending" : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
