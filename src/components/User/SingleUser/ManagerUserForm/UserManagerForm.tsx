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
import DesignPrint from "../../../Print/DesignPrint/DesignPrint";
import PrintPreview from '../../../Print/PrintPreview/PrintPreview';

interface User {
  id?: string;
  code?: string;
  password?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  image?: string;
  isActive: boolean | string | number; // Allow boolean, string, or number
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
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

// const userSchema: RuleSchema = {
//   id: { type: "string", format: "uuid", min: 2, required: false },
//   code: { type: "string", required: true, min: 2, max: 20, regex: "^[a-zA-Z0-9_]+$" },
//   password: { type: "string", required: false, min: 2, max: 30 },
//   name: { type: "string", required: true, min: 2, max: 100 },
//   email: { type: "string", required: true, format: "email" },
//   phone: { type: "string", required: false, format: "phone" }
// };


const userSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, min: 2, max: 100 },
  password: { type: "string", required: false, max: 255 },
  name: { type: "string", required: true, min: 2, max: 255 },
  address: { type: "string", required: false, max: 255 },
  email: { type: "string", format: "email", required: true, max: 100 },
  phone: { type: "string", required: false, format: "phone", max: 20 },
  image: { type: "string", required: false, max: 255 },
  isActive: { type: "boolean", required: true },
  // isSystem: { type: "boolean", required: false },
  // createdBy: { type: "string", required: false, max: 100 },
  // updatedBy: { type: "string", required: false, max: 100 },
  // createdAt: { type: "string", format: "datetime", required: false },
  // updatedAt: { type: "string", format: "datetime", required: false }
};

const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Tên đăng nhập (*)", type: "text", placeholder: "Nhập tên đăng nhập" },
  password: { label: "Mật khẩu (*)", type: "password", placeholder: "Nhập mật khẩu" },
  name: { label: "Họ và tên (*)", type: "text", placeholder: "Nhập họ và tên" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  email: { label: "Email (*)", type: "email", placeholder: "Nhập email" },
  phone: { label: "Điện thoại", type: "text", placeholder: "Nhập số điện thoại" },
  image: { label: "Avata", type: "text", placeholder: "Nhập Avata link" },
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
    code: "",
    password: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    image: "",
    isActive: true
  });

  const [userDefaultData, setUserDefaultData] = useState<User>({
    code: "",
    password: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    image: "",
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
        code: user.code,
        password: "", // Don't pre-fill password
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        image: user.image,
        isActive: user.isActive === 1 ? true : false
      });
      setIsEditing(true);
      setErrors({})
      setUserDefaultData({
        id: user.id,
        code: user.code,
        password: "", // Don't pre-fill password
        name: user.name,
        address: user.address,
        email: user.email,
        phone: user.phone,
        image: user.image,
        isActive: user.isActive === 1 ? true : false
      });
    } else {
      resetForm();
    }
  }, [user]);

  useEffect(() => {
    // if (isEditing) return;
    const timer = setTimeout(async () => {
      if (userData.code || userData.email) {
        const checkUser = { code: userData.code, email: userData.email, id: userData.id }
        const result = await checkUserAvailability({ urlCheckUser, urlRefreshToken, user: checkUser });
        const newErrors: Partial<User> = {};
        if (result.code) newErrors.code = "Tên đăng nhập đã tồn tại";
        if (result.email) newErrors.email = "Email đã tồn tại";
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userData.code, userData.email, userData.id, isEditing]);

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
        code: "Có lỗi xảy ra",
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

      const checkUser = { code: userData.code, email: userData.email, id: userData.id }
      const checkResult = await checkUserAvailability({ urlCheckUser, urlRefreshToken, user: checkUser });
      const checkErrors: Partial<User> = {};
      if (checkResult.code) checkErrors.code = "Tên đăng nhập đã tồn tại";
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
        code: "Có lỗi xảy ra",
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
      code: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      isActive: true
    });
    setErrors({});
    setIsEditing(false);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors &&
    (isEditing ? true : (!!userData.code && !!userData.password));


  const [alertinfo, setAlertinfo] = useState<AlertInfo>({
    isAlertShow: false,
    alertMessage: '',
    type: 'error',
    title: 'Lỗi',
    showConfirm: true,
    showCancel: true
  });

  const handleOnCancel = (cancel: boolean) => {
    setIsPrintDesign(!cancel)
  }
  const handleOnPrintCancel = (cancel: boolean) => {
    setIsPrintView(!cancel)
  }




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

          {isEditing && (<button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintDesign(true) }}
            disabled={isSubmitting}
          >
            Design print
          </button>
          )}
          {isEditing && (<button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintView(true) }}
            disabled={isSubmitting}
          >
            print view
          </button>
          )}
        </div>
      </form>

      {isPrintDesign &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
          <DesignPrint
            urlGet="http://localhost:3000/template-contents/user/list"
            urlUpdate="http://localhost:3000/template-contents/user/detail"
            urlDelete="http://localhost:3000/template-contents/user/detail"
            urlInsert="http://localhost:3000/template-contents/user/detail/insert"
            dynamicTexts={userData}
            // contentStateObject={blockUser}
            onCancel={handleOnCancel}
            title="Thiết kế mẫu in thông tin người dùng"
          >
          </DesignPrint>

        </div>, document.body)
      }

      {isPrintView &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '80vh', scale: "0.8" }} >
          <PrintPreview
            dynamicTexts={userData}
            // contentStateObject={blockUser}
            urlGet="http://localhost:3000/template-contents/user/list"
            onCancel={handleOnPrintCancel}
          >
          </PrintPreview>

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
      "text": "Tên Đăng nhập: {{code}}",
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
      "text": "Họ và tên: {{name}}",
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