import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./RegistrationForm.module.scss";
import { validateDataArray, messagesVi } from "../../../../utils/validation";
import type { RuleSchema } from "../../../../utils/validation";
import { getAuthHeaders, postData } from "../../../../utils/axios";
import checkUserAvailability from "../checkUserAvailability";


interface User {
  id?: string;
  code?: string;
  password?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  image?: string;
}

interface RegistrationFormProps {
  urlCheckUser?: string;
  urlInsertUser?: string;
  urlRefreshToken?: string;
  zoneId?: string;
  onRegisterSuccess?: (params: { action: 'insert' | 'cancel', user?: User }) => void;
}

const registrationSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  password: { type: "string", required: false, maxLength: 255 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  email: { type: "string", format: "email", required: true, maxLength: 100 },
  phone: { type: "string", required: false, format: "phone", maxLength: 20 },
  image: { type: "string", required: false, maxLength: 255 },
};


const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Tên đăng nhập(*)", type: "text", placeholder: "Nhập tên đăng nhập" },
  password: { label: "Mật khẩu (*)", type: "password", placeholder: "Nhập mật khẩu" },
  repassword: { label: "Nhập lại mật khẩu (*)", type: "password", placeholder: "Nhập lại mật khẩu" },
  name: { label: "Họ và tên (*)", type: "text", placeholder: "Nhập họ và tên" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  email: { label: "Email (*)", type: "email", placeholder: "Nhập email" },
  image: { label: "Avata", type: "text", placeholder: "Nhập Avata link" },
  phone: { label: "Điện thoại", type: "text", placeholder: "Nhập số điện thoại" },
};


export default function RegistrationForm({
  urlCheckUser = 'http://localhost:3000/auth/user/check-user',
  urlInsertUser = 'http://localhost:3000/auth/user/detail/insert',
  urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
  onRegisterSuccess = () => { },
}: RegistrationFormProps) {
  const [userData, setUserData] = useState<User>({
    code: "",
    password: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    image: "",
  });
  const [rePassword, setRePassword] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userData.code || userData.email) {

        const checkUser = { code: userData.code, email: userData.email, id: userData.id }
        const result = await checkUserAvailability({ urlCheckUser, urlRefreshToken, user: checkUser });
        // const result = await checkUserAvailability({urlCheckUser, urlRefreshToken, code: userData.code, email: userData.email, id: userData.id});
        const newErrors: Partial<User> = {};
        if (result.code) newErrors.code = "Tên đăng nhập đã tồn tại";
        if (result.email) newErrors.email = "Email đã tồn tại";
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [userData.code, userData.email]);


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

  const handleRepasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRePassword(value);
    if (value !== userData.password) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu không khớp", repassword: "Mật khẩu không khớp" }));
    } else {

      const singleFieldData = { password: userData.password };
      const result = validateDataArray([singleFieldData], registrationSchema, messagesVi);

      let newValidateErrors: Partial<Record<keyof User, string>> = {};
      let newNotEqualErrors = {
        password: "",
        repassword: ""
      };

      if (!result.status) {
        newValidateErrors = {
          password: result.results[0]?.errors?.password || ""
        };
      }

      if (newValidateErrors.password === "" || !newValidateErrors.password) {
        setErrors((prev) => ({ ...prev, ...newNotEqualErrors }));
      } else {
        setErrors((prev) => ({ ...prev, ...newValidateErrors }));
      }
    }
  };


  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const singleFieldData = { [name]: value };
    const result = validateDataArray([singleFieldData], registrationSchema, messagesVi);

    let newValidateErrors: Partial<Record<keyof User, string>> = {};
    let newNotEqualErrors

    if (!result.status) {
      newValidateErrors = {
        [name]: result.results[0]?.errors?.[name] || ""
      };
    }

    if (!rePassword || value !== rePassword || rePassword === "") {
      newNotEqualErrors = {
        password: "Mật khẩu không khớp",
        repassword: "Mật khẩu không khớp"
      };
    } else {
      newNotEqualErrors = {
        password: "",
        repassword: ""
      };
    }

    if (newValidateErrors.password === "" || !newValidateErrors.password) {
      setErrors((prev) => ({ ...prev, ...newNotEqualErrors }));
    } else {
      setErrors((prev) => ({ ...prev, ...newValidateErrors }));
    }

    setUserData((prev) => ({ ...prev, password: value }));
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
      const checkUser = { code: userData.code, email: userData.email, id: userData.id }
      const checkResult = await checkUserAvailability({ urlCheckUser, urlRefreshToken, user: checkUser });

      // const checkResult = await checkUserAvailability({ urlCheckUser, urlRefreshToken, code: userData.code, email: userData.email, id: userData.id });
      const checkErrors: Partial<User> = {};
      if (checkResult.code) checkErrors.code = "Tên đăng nhập đã tồn tại";
      if (checkResult.email) checkErrors.email = "Email đã tồn tại";
      if (Object.keys(checkErrors).length > 0) {
        setErrors(checkErrors);
        return;
      }

      // validate dữ liệu
      if (!validateForm()) return;

      // insert user
      const headers = getAuthHeaders();

      const insertUser = {
        code: userData.code,
        password: userData.password,
        name: userData.name,
        address: userData.address,
        email: userData.email,
        phone: userData.phone,
        image: userData.image,
        isActive: true,
        createdBy: "Register"
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
        onRegisterSuccess?.({ action: "insert", user: userData });
      }

      setUserData({
        id: "",
        code: "",
        password: "",
        name: "",
        address: "",
        email: "",
        phone: "",
        image: "",
      });
      setRePassword("");
      setErrors({});
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        code: "Có lỗi xảy ra khi đăng ký",
        email: "Có lỗi xảy ra khi đăng ký"
      });
    }
  };


  const handleCancelForm = () => {
    setUserData({
      id: "",
      code: "",
      password: "",
      name: "",
      address: "",
      email: "",
      phone: "",
      image: "",
    });
    setRePassword("");
    setErrors({});
    onRegisterSuccess?.({ action: "cancel", user: userData });
  }
  // Xem còn lỗi hay không (để đổi style/hiển thị thông báo)
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {field === "repassword" ?
              <input
                type="password"
                id={field}
                name={field}
                value={rePassword}
                placeholder={placeholder}
                onChange={handleRepasswordChange}
              />
              : field === "password" ?
                <input
                  type="password"
                  id={field}
                  name={field}
                  value={userData.password ?? ''}
                  placeholder={placeholder}
                  onChange={handlePasswordChange}
                />
                : type === "checkbox" ? (
                  <input
                    type="checkbox"
                    id={field}
                    name={field}
                    checked={Boolean(userData[field as keyof User])}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={type}
                    id={field}
                    name={field}
                    value={String((userData as any)[field]) ?? ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={errors[field as keyof User] ? styles.errorInput : ""}
                  />
                )}
            {errors[field as keyof User] && (
              <span className={styles.error}>{errors[field as keyof User]}</span>
            )}
          </div>
        ))}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={`${styles.submitBtn} ${(hasErrors) ? styles.disabled : ""}`}
            disabled={hasErrors ? true : false}
          >
            {hasErrors ? "Pending" : "Đăng ký"}
          </button>
          <button onClick={handleCancelForm}>Hủy</button>
        </div>
      </form>
    </div>
  );
}
