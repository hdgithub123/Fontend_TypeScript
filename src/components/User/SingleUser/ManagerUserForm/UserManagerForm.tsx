import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./UserManagerForm.module.scss";
import { validateDataArray, messagesVi } from "../../../../utils/validation";
import type { RuleSchema } from "../../../../utils/validation";
import { postData, deleteData, putData, getAuthHeaders } from "../../../../utils/axios/index";
import { AlertDialog, type AlertInfo } from '../../../../utils/AlertDialog';
import { v4 as uuidv4 } from 'uuid';
import checkUserAvailability from "../checkUserAvailability";
import { HRichTextEditor, HRichTextEditorPrintPreview, HRichTextEditorPreview } from 'hrich-text-editor'
import ReactDOM from 'react-dom';

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


interface UserManagementFormProps {
  urlCheckUser?: string;
  urlInsertUser?: string;
  urlUpdateUser?: string;
  urlDeleteUser?: string;
  urlRefreshToken?: string;
  zoneId?: string;
  user?: User | null; // Changed from initialUser to user
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', user?: User }) => void;
}

const userSchema: RuleSchema = {
  id: { type: "string", format: "uuid", min: 2, required: false },
  username: { type: "string", required: true, min: 2, max: 20, regex: "^[a-zA-Z0-9_]+$" },
  password: { type: "string", required: false, min: 2, max: 30 },
  fullName: { type: "string", required: true, min: 2, max: 50 },
  email: { type: "string", required: true, format: "email" },
  phone: { type: "string", required: false, format: "phone" }
};


const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  username: { label: "Tên đăng nhập (*)", type: "text", placeholder: "Nhập tên đăng nhập" },
  password: { label: "Mật khẩu (*)", type: "password", placeholder: "Nhập mật khẩu" },
  fullName: { label: "Họ và tên (*)", type: "text", placeholder: "Nhập họ và tên" },
  email: { label: "Email (*)", type: "email", placeholder: "Nhập email" },
  phone: { label: "Điện thoại", type: "text", placeholder: "Nhập số điện thoại" },
  isActive: { label: "Trạng thái (*)", type: "checkbox" }
};


export default function UserManagerForm({
  urlCheckUser = 'http://localhost:3000/auth/user/check-user',
  urlInsertUser = 'http://localhost:3000/auth/user/detail/insert',
  urlUpdateUser = 'http://localhost:3000/auth/user/detail',
  urlDeleteUser = 'http://localhost:3000/auth/user/detail',

  urlRefreshToken = 'http://localhost:3000/auth/refresh-token',
  user = null, // Changed parameter name
  onSuccess = () => { }
}: UserManagementFormProps) {
  const [userData, setUserData] = useState<User>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    isActive: true
  });

  const [userDefaultData, setUserDefaultData] = useState<User>({
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
        isActive: user.isActive === 1 ? true : false
      });
      setIsEditing(true);
      setErrors({})
      setUserDefaultData({
        id: user.id,
        username: user.username,
        password: "", // Don't pre-fill password
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive === 1 ? true : false
      });
    } else {
      resetForm();
    }
  }, [user]);

  useEffect(() => {
    // if (isEditing) return;
    const timer = setTimeout(async () => {
      if (userData.username || userData.email) {
        const result = await checkUserAvailability({ urlCheckUser, urlRefreshToken, username: userData.username, email: userData.email, id: userData.id });
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


  const handleConfirmSubmit = async () => {
    try {
      const headers = getAuthHeaders();
      let result;

      if (isEditing) {
        const payload: Partial<User> = {
          ...userData,
          isActive: userData.isActive === 1 || userData.isActive === true,
        };

        if (payload.password === "") {
          delete payload.password;
        }

        // so sánh với payload với user lấy ra các trường khác nhau để đưa vào update, không tính password
        const updatedFields = Object.keys(payload).reduce((acc, key) => {
          if (
            key === "id" || // luôn lấy id
            userDefaultData[key as keyof User] !== payload[key as keyof User]
          ) {
            acc[key as keyof User] = payload[key as keyof User];
          }
          return acc;
        }, {} as Partial<User>);

        result = await putData({
          url: `${urlUpdateUser}/${userData.id}`,
          data: updatedFields,
          headers,
          urlRefreshToken,
        });

        if (result?.status) {
          setUserDefaultData((prev) => ({ ...prev, ...payload }));
          onSuccess?.({ action: "update", user: userData });
        }



      } else {
        const newId = uuidv4();
        const userToCreate: User = {
          ...userData,
          id: newId,
        };

        result = await postData({
          url: urlInsertUser,
          data: userToCreate,
          headers,
          urlRefreshToken,
        });
        if (result?.status) {
          setUserData(userToCreate);
          setUserDefaultData(userToCreate);
          setIsEditing(true);
          onSuccess?.({ action: "insert", user: result.data });
        }
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const checkResult = await checkUserAvailability({ urlCheckUser, urlRefreshToken, username: userData.username, email: userData.email, id: userData.id });
      const checkErrors: Partial<User> = {};

      if (checkResult.username) checkErrors.username = "Tên đăng nhập đã tồn tại";
      if (checkResult.email) checkErrors.email = "Email đã tồn tại";

      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        setIsSubmitting(false);
        return;
      }

      // ✅ Hiển thị cảnh báo xác nhận
      setAlertinfo({
        isAlertShow: true,
        alertMessage: isEditing
          ? "Bạn có chắc chắn muốn cập nhật người dùng này?"
          : "Bạn có chắc chắn muốn tạo người dùng mới?",
        type: "warning",
        title: "Xác nhận",
        onConfirm: () => {
          handleConfirmSubmit()
          setAlertinfo(prev => ({ ...prev, isAlertShow: false }));
        },
        onCancel: () => {
          setAlertinfo(prev => ({ ...prev, isAlertShow: false }));
          setIsSubmitting(false);
        },
        onClose: () => {
          setAlertinfo(prev => ({ ...prev, isAlertShow: false }));
          setIsSubmitting(false);
        }
      });
    } catch (err) {
      console.error("Validation failed:", err);
      setErrors({
        username: "Có lỗi xảy ra",
        email: "Có lỗi xảy ra"
      });
      setIsSubmitting(false);
    }
  };


  const handleDelete = () => {
    if (!userData.id) return;

    setAlertinfo({
      isAlertShow: true,
      alertMessage: "Bạn có chắc chắn muốn xóa người dùng này?",
      type: "warning", // "error" thường dùng cho lỗi, "warning" hợp hơn cho xác nhận
      title: "Xác nhận xóa",
      onConfirm: async () => {
        try {
          const result = await deleteData({
            url: `${urlDeleteUser}/${userData.id}`,
            headers: getAuthHeaders(),
            data: {},
            urlRefreshToken,
          });

          if (result?.status) {
            onSuccess?.({ action: "delete", user: userData });
            resetForm();
          }
        } catch (err) {
          console.error("Delete failed:", err);
        } finally {
          setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
        }
      },
      onCancel: () => {
        console.log("Delete cancelled");
        setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
      },
      onClose: () => {
        console.log("Đóng hộp thoại");
        setAlertinfo((prev) => ({ ...prev, isAlertShow: false }));
      },
    });
  };


  const cancelForm = () => {
    resetForm();
    onSuccess?.({ action: "cancel", user: userData });
  }

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


  const [alertinfo, setAlertinfo] = useState<AlertInfo>({
    isAlertShow: false,
    alertMessage: '',
    type: 'error',
    title: 'Lỗi',
    showConfirm: true,
    showCancel: true
  });

  const [isPrintDesign, setIsPrintDesign] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);



  return (
    <div className={styles.userManagementContainer}>
      <AlertDialog
        type={alertinfo.type || "error"}
        title={alertinfo.title || "Lỗi"}
        message={alertinfo.alertMessage || ""}
        show={alertinfo.isAlertShow || false}
        onClose={alertinfo.onClose ?? (() => { })}
        onConfirm={alertinfo.onConfirm ?? (() => { })}
        onCancel={alertinfo.onCancel ?? (() => { })}
        showConfirm={alertinfo.showConfirm ?? true}
        showCancel={alertinfo.showCancel ?? true}
      />
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
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Xóa
            </button>
          )}

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={cancelForm}
            disabled={isSubmitting}
          >
            Hủy
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintDesign(true) }}
            disabled={isSubmitting}
          >
            Design print
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintView(true) }}
            disabled={isSubmitting}
          >
            print view
          </button>

        </div>
      </form>

      {isPrintDesign &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh',scale:'0.8', overflowY:'visible',overflowX:'visible' }} >
          <button onClick={() => { setIsPrintDesign(false) }}>Close</button>
          <HRichTextEditor
            dynamicTexts={userData}
            contentStateObject={blockUser}
          >
          </HRichTextEditor>

        </div>, document.body)
      }

      {isPrintView &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh',scale:"0.8" }} >
          <button onClick={() => { setIsPrintView(false) }}>Close</button>
          <HRichTextEditorPrintPreview
            dynamicTexts={userData}
            contentStateObject={blockUser}
          >
          </HRichTextEditorPrintPreview>

        </div>, document.body)
      }

    </div>
  );
}


const blockUser = {
  "blocks": [
    {
      "key": "1fuk8",
      "text": "Đây là thông tin của user :",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "dmv25",
      "text": "Tên Đăng nhập: {{username}}",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "3jvnr",
      "text": "Mật khẩu: {{password}}",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "b6ifd",
      "text": "Họ và tên: {{fullName}}",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "bt2jg",
      "text": "Email: {{email}}",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "a38h3",
      "text": "Điện thoại: {{phone}}",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "6knof",
      "text": "Trạng Thái:[{isActive !== true? 'Không hoạt động' : 'Hoạt động'}]",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "mainBlock",
      "text": "",
      "type": "MAIN_BLOCK",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {
        "blockStyle": {
          "paddingTop": "20mm",
          "width": "210mm",
          "marginTop": "0mm",
          "height": "auto",
          "paddingRight": "15mm",
          "marginRight": "0mm",
          "marginLeft": "0mm",
          "paddingLeft": "30mm",
          "marginBottom": "0mm",
          "paddingBottom": "20mm"
        },
        "pageSetup": {
          "pageHeight": "148mm",
          "isRepeatThead": true,
          "pageNumber": {
            "position": "",
            "format": "",
            "style": {
              "display": "none"
            }
          }
        },
        "backgroundCss": {},
        "unit": "mm"
      }
    }
  ],
  "entityMap": {}
}