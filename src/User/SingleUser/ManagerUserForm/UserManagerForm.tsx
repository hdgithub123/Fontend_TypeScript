import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./UserManagerForm.module.scss";
import { validateDataArray, messagesVi } from "../../../validation";
import type { RuleSchema } from "../../../validation";
import { postData, deleteData, putData } from "../../../Axios";

interface User {
  id?: string; // Changed from id to id
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean | string | number; // Allow boolean, string, or number
  createdDate?: string;
}

interface UserCheckResult {
  username?: boolean;
  email?: boolean;
}

interface UserManagementFormProps {
  urlCheckUser?: string;
  urlInsertUser?: string;
  urlUpdateUser?: string;
  urlDeleteUser?: string;
  urlRefreshToken?: string;
  zoneId?: string;
  user?: User | null; // Changed from initialUser to user
  onSuccess?: (action: 'create' | 'update' | 'delete', user?: User) => void;
}

const userSchema: RuleSchema = {
  id: {type: "string",format: "uuid",min: 2,required: false},
  username: { type: "string", required: true, min: 6, max: 20, regex: "^[a-zA-Z0-9_]+$" },
  password: { type: "string", required: false, min: 8, max: 30 },
  fullName: { type: "string", required: true, min: 2, max: 50 },
  email: { type: "string", required: true, format: "email" },
  phone: { type: "string", required: false, format: "phone" }
};


const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  username: { label: "Tên đăng nhập", type: "text", placeholder: "Nhập tên đăng nhập" },
  password: { label: "Mật khẩu", type: "password", placeholder: "Nhập mật khẩu" },
  fullName: { label: "Họ và tên", type: "text", placeholder: "Nhập họ và tên" },
  email: { label: "Email", type: "email", placeholder: "Nhập email" },
  phone: { label: "Điện thoại", type: "text", placeholder: "Nhập số điện thoại" },
  isActive: { label: "Trạng thái", type: "checkbox" }
};


export default function UserManagerForm({
  urlCheckUser = 'http://localhost:3000/auth/user/check-user',
  urlInsertUser = 'http://localhost:3000/auth/user/detail/insert',
  urlUpdateUser = 'http://localhost:3000/auth/user/detail',
  urlDeleteUser = 'http://localhost:3000/auth/user/detail',

  urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
  zoneId = '8e522402-3611-11f0-b432-0242ac110002',
  user = null, // Changed parameter name
  onSuccess
}: UserManagementFormProps) {
  const [userData, setUserData] = useState<User>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        username: user.username,
        password: "", // Don't pre-fill password
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive
      });
      setIsEditing(true);
      setErrors({})
    } else {
      resetForm();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${token}`,
      zone: zoneId,
      is_child_zone: true
    };
  };


  const checkUserAvailability = async (username: string, email: string, id: string | null | undefined): Promise<UserCheckResult> => {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${token}`,
      zone: zoneId,
      is_child_zone: true
    };
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

  useEffect(() => {
    // if (isEditing) return;
    const timer = setTimeout(async () => {
      if (userData.username || userData.email) {
        const result = await checkUserAvailability(userData.username, userData.email, userData.id);
        const newErrors: Partial<User> = {};
        if (result.username) newErrors.username = "Tên đăng nhập đã tồn tại";
        if (result.email) newErrors.email = "Email đã tồn tại";
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userData.username, userData.email, userData.id, isEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setUserData(prev => ({ ...prev, [name]: val }));

    const singleFieldData = { [name]: val };
    const result = validateDataArray([singleFieldData], userSchema, messagesVi);

    setErrors(prev => ({
      ...prev,
      [name]: result.status ? "" : (result.results[0]?.errors?.[name] || "")
    }));
  };

  const validateForm = () => {
    const result = validateDataArray([userData], userSchema, messagesVi);
    if (!result.status) {
      setErrors(result.results[0]?.errors || {});
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) return;

      const checkResult = await checkUserAvailability(userData.username, userData.email, userData.id);
      const checkErrors: Partial<User> = {};
      if (checkResult.username) checkErrors.username = "Tên đăng nhập đã tồn tại";
      if (checkResult.email) checkErrors.email = "Email đã tồn tại";
      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        return;
      }

      const headers = getAuthHeaders();
      let result;

      if (isEditing) {
        // Update existing user
        let payload: Partial<User> = { ...userData, isActive: userData.isActive === 1 || userData.isActive === true ? true : false };
        if (payload.password) {
          delete payload.password;
        }


        result = await putData({
          url: `${urlUpdateUser}/${userData.id}`,
          data: payload,
          headers,
          urlRefreshToken
        });

        onSuccess?.('update', userData);
      } else {
        // Create new user
        result = await postData({
          url: urlInsertUser,
          data: userData,
          headers,
          urlRefreshToken
        });
        onSuccess?.('create', result.data);
      }

      if (result.status) {
        resetForm();
      }
    } catch (err) {
      console.error("Operation failed:", err);
      setErrors({
        username: "Có lỗi xảy ra",
        email: "Có lỗi xảy ra"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userData.id || !confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const result = await deleteData({
        url: `${urlDeleteUser}/${userData.id}`,
        headers: getAuthHeaders(),
        data: {},
        urlRefreshToken
      });

      if (result?.status) {
        onSuccess?.('delete', userData);
        resetForm();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const resetForm = () => {
    setUserData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      isActive: true
    });
    setErrors({});
    setIsEditing(false);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors &&
    (isEditing ? true : (!!userData.username && !!userData.password));

  return (
    <div className={styles.userManagementContainer}>
      <h2 className={styles.title}>
        {isEditing ? `Cập nhật người dùng` : "Thêm người dùng mới"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.userForm}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {type === "checkbox" ? (
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={Boolean(userData.isActive)}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                id={field}
                name={field}
                value={userData[field as keyof User] || ""}
                onChange={handleChange}
                placeholder={placeholder}
                className={errors[field as keyof User] ? styles.errorInput : ""}
              />
            )}
            {errors[field as keyof User] && <span className={styles.error}>{errors[field as keyof User]}</span>}
          </div>
        ))}


        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
          </button>

          {isEditing && (
            <>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Xóa
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Hủy
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}