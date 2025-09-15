import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./EditForm.module.scss";
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




const userSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  password: { type: "string", required: false, minLength: 2, maxLength: 255 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  email: { type: "string", format: "email", required: true, maxLength: 100 },
  phone: { type: "string", required: false, format: "phone", maxLength: 20 },
  image: { type: "string", required: false, maxLength: 255 },
  isActive: { type: "boolean", required: false },
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
  urlUpdateUser = 'http://localhost:3000/auth/user/detail',
  urlDeleteUser = 'http://localhost:3000/auth/user/detail',

  user = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: UserManagementFormProps) {
  const [userData, setUserData] = useState<User>({});

  const [userDefaultData, setUserDefaultData] = useState<User>({});

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setUserData({
        password: "", // Don't pre-fill password
        ...user,
      });

      setUserDefaultData({
        password: "", // Don't pre-fill password
        ...user,
      });
    } else {
      resetForm();
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userData.code || userData.email) {
        const checkUser = { code: userData.code, email: userData.email, id: userData.id }
        const result = await checkUserAvailability({ urlCheckUser, user: checkUser });
        const newErrors: Partial<User> = {};
        if (result.code) newErrors.code = "Tên đăng nhập đã tồn tại";
        if (result.email) newErrors.email = "Email đã tồn tại";
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userData.code, userData.email, userData.id]);

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



  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        return;
      }

      const checkUser = { code: userData.code, email: userData.email, id: userData.id };
      const checkResult = await checkUserAvailability({ urlCheckUser, user: checkUser });
      const checkErrors: Partial<User> = {};
      if (checkResult.code) checkErrors.code = "Tên đăng nhập đã tồn tại";
      if (checkResult.email) checkErrors.email = "Email đã tồn tại";

      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có chắc chắn muốn cập nhật người dùng này?",
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          const payload: Partial<User> = {
            ...userData,
            isActive: userData.isActive,
          };

          const updatedFields = Object.keys(payload).reduce((acc, key) => {
            if (
              key === "id" ||
              userDefaultData[key as keyof User] !== payload[key as keyof User]
            ) {
              acc[key as keyof User] = payload[key as keyof User];
            }
            return acc;
          }, {} as Partial<User>);

          const result = await putData({
            url: `${urlUpdateUser}/${userData.id}`,
            data: updatedFields,
          });

          if (result?.status) {
            setUserDefaultData(prev => ({ ...prev, ...payload }));
            onSuccess?.({ action: "update", user: userData });
          } else {
            setAlertinfo({
              isAlertShow: true,
              alertMessage:
                result?.errorCode?.failData?.code === "Not allow edit admin"
                  ? "Không được sửa tên đăng nhập admin"
                  : "Có lỗi xảy ra",
              type: "error",
              title: "Lỗi",
              showConfirm: true,
              showCancel: false,
              onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
              onConfirm: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            });
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
      });
    } catch (err) {
      console.error("Update failed:", err);
      setErrors({ code: "Có lỗi xảy ra", email: "Có lỗi xảy ra" });
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
        const result = await deleteData({
          url: `${urlDeleteUser}/${userData.id}`,
        });

        if (result?.status) {
          onSuccess?.({ action: "delete", user: userData });
          resetForm();
        } else {
          setAlertinfo({
            isAlertShow: true,
            alertMessage: result?.errorCode?.failData?.code === "Not allow delete admin" ? "Không được xóa tên đăng nhập admin" : result?.errorCode?.failData?.isSystem === "Cannot delete system records" ? "Không được xóa thông tin hệ thống" : "Xóa người dùng thất bại",
            type: "error",
            title: "Lỗi",
            showConfirm: true,
            showCancel: false,
            onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            onConfirm: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
          });
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
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors &&
    (!!userData.code);


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
      {authorization.view && <h2 className={styles.title}>
        {authorization.update ? "Cập nhật người dùng" : "Thông tin người dùng"}
      </h2>}

      {(authorization.view) && <form className={styles.userForm}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {type === "checkbox" ? (
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={Boolean(userData.isActive) || false}
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
          {authorization.update && (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFormValid}
              onClick={handleUpdate}
            >
              Save
            </button>
          )}

          {authorization.delete && (
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={cancelForm}
          >
            Cancel
          </button>

          {authorization.viewPrintDesign && (<button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintDesign(true) }}
          >
            Design print
          </button>
          )}
          {authorization.print && (<button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintView(true) }}
          >
            Print
          </button>
          )}
        </div>
      </form>
      }

      {isPrintDesign && authorization.viewPrintDesign &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
          <DesignPrint
            urlGet="http://localhost:3000/template-contents/user/list"
            urlUpdate="http://localhost:3000/template-contents/user/detail"
            urlDelete="http://localhost:3000/template-contents/user/detail"
            urlInsert="http://localhost:3000/template-contents/user/detail/insert"
            dynamicTexts={userData || {}}
            // contentStateObject={blockUser}
            onCancel={handleOnCancel}
            title="Thiết kế mẫu in thông tin người dùng"
            authorization={{
              add: authorization.addPrintDesign,
              update: authorization.updatePrintDesign,
              delete: authorization.deletePrintDesign,
              view: authorization.viewPrintDesign,
            }}
          >
          </DesignPrint>

        </div>, document.body)
      }

      {isPrintView && authorization.print &&
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