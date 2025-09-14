import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./OrganizationManagerForm.module.scss";
import { validateDataArray, messagesVi } from "../../../../utils/validation";
import type { RuleSchema } from "../../../../utils/validation";
import { postData, deleteData, putData, getAuthHeaders } from "../../../../utils/axios/index";
import { AlertDialog, type AlertInfo } from '../../../../utils/AlertDialog';
import { v4 as uuidv4 } from 'uuid';
import checkOrganizationAvailability from "../checkOrganizationAvailability";
import { HRichTextEditor, HRichTextEditorPrintPreview, HRichTextEditorPreview } from 'hrich-text-editor'
import ReactDOM from 'react-dom';
import DesignPrint from "../../../Print/DesignPrint/DesignPrint";
import PrintPreview from '../../../Print/PrintPreview/PrintPreview';
import { add } from "mathjs";

interface Organization {
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  isActive: boolean | string | number; // Allow boolean, string, or number
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}




interface OrganizationManagementFormProps {
  urlCheckOrganization?: string;
  urlInsertOrganization?: string;
  urlUpdateOrganization?: string;
  urlDeleteOrganization?: string;
  urlRefreshToken?: string;
  zoneId?: string;
  organization?: Organization | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', organization?: Organization }) => void;
  authorization: object;
}




const organizationSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  isActive: { type: "boolean", required: false },
  // isSystem: { type: "boolean", required: false },
  // createdBy: { type: "string", required: false, max: 100 },
  // updatedBy: { type: "string", required: false, max: 100 },
  // createdAt: { type: "string", format: "datetime", required: false },
  // updatedAt: { type: "string", format: "datetime", required: false }
};

const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã Tổ chức (*)", type: "text", placeholder: "Nhập mã tổ chức" },
  name: { label: "Tên Tổ chức (*)", type: "text", placeholder: "Nhập tên tổ chức" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  isActive: { label: "Trạng thái (*)", type: "checkbox" }
};


export default function OrganizationManagerForm({
  urlCheckOrganization = 'http://localhost:3000/auth/organization/check-organization',
  urlInsertOrganization = 'http://localhost:3000/auth/organization/detail/insert',
  urlUpdateOrganization = 'http://localhost:3000/auth/organization/detail',
  urlDeleteOrganization = 'http://localhost:3000/auth/organization/detail',

  organization = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: OrganizationManagementFormProps) {
  const [organizationData, setOrganizationData] = useState<Organization>({
    code: "",
    name: "",
    address: "",
    isActive: true
  });

  const [organizationDefaultData, setOrganizationDefaultData] = useState<Organization>({
    code: "",
    name: "",
    address: "",
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Organization, string>>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with organization data
  useEffect(() => {
    if (organization) {
      setOrganizationData({
        id: organization.id,
        code: organization.code,
        name: organization.name,
        address: organization.address,
        isActive: organization.isActive,
      });
      setIsEditing(true);
      setErrors({})
      setOrganizationDefaultData({
        id: organization.id,
        code: organization.code,
        name: organization.name,
        address: organization.address,
        isActive: organization.isActive,
      });
    } else {
      resetForm();
    }

  }, [organization]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (organizationData.code) {
        const checkOrganization = { code: organizationData.code, id: organizationData.id }
        const result = await checkOrganizationAvailability({ urlCheckOrganization, organization: checkOrganization });
        const newErrors: Partial<Organization> = {};
        if (result.code) newErrors.code = "Mã tổ chức đã tồn tại";
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [organizationData.code, organizationData.id, isEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setOrganizationData(prev => ({ ...prev, [name]: val }));

    const singleFieldData = { [name]: val };
    const result = validateDataArray([singleFieldData], organizationSchema, messagesVi);

    setErrors(prev => ({
      ...prev,
      [name]: result.status ? "" : (result.results[0]?.errors?.[name] || "")
    }));
  };

  const validateForm = () => {
    const result = validateDataArray([organizationData], organizationSchema, messagesVi);
    if (!result.status) {
      setErrors(result.results[0]?.errors || {});
      return false;
    }
    return true;
  };



  const handleInsert = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const checkOrganization = { code: organizationData.code, id: organizationData.id };
      const checkResult = await checkOrganizationAvailability({ urlCheckOrganization, organization: checkOrganization });
      const checkErrors: Partial<Organization> = {};
      if (checkResult.code) checkErrors.code = "Tên tổ chức đã tồn tại";

      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        setIsSubmitting(false);
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có chắc chắn muốn tạo tổ chức mới?",
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          try {
            const newId = uuidv4();
            const organizationToCreate: Organization = { ...organizationData, id: newId };
            const result = await postData({
              url: urlInsertOrganization,
              data: organizationToCreate,
            });
            if (result?.status) {
              setOrganizationData(organizationToCreate);
              setOrganizationDefaultData(organizationToCreate);
              setIsEditing(true);
              onSuccess?.({ action: "insert", organization: result.data });
            }
          } finally {
            setIsSubmitting(false);
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
      });
    } catch (err) {
      console.error("Insert failed:", err);
      setErrors({ code: "Có lỗi xảy ra" });
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const checkOrganization = { code: organizationData.code, id: organizationData.id };
      const checkResult = await checkOrganizationAvailability({ urlCheckOrganization, organization: checkOrganization });
      const checkErrors: Partial<Organization> = {};
      if (checkResult.code) checkErrors.code = "Tên tổ chức đã tồn tại";

      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        setIsSubmitting(false);
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có chắc chắn muốn cập nhật người dùng này?",
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          try {
            const payload: Partial<Organization> = {
              ...organizationData,
              isActive: organizationData.isActive === 1 || organizationData.isActive === true,
            };


            const updatedFields = Object.keys(payload).reduce((acc, key) => {
              if (
                key === "id" ||
                organizationDefaultData[key as keyof Organization] !== payload[key as keyof Organization]
              ) {
                acc[key as keyof Organization] = payload[key as keyof Organization];
              }
              return acc;
            }, {} as Partial<Organization>);

            const result = await putData({
              url: `${urlUpdateOrganization}/${organizationData.id}`,
              data: updatedFields,
            });

            if (result?.status) {
              setOrganizationDefaultData(prev => ({ ...prev, ...payload }));
              onSuccess?.({ action: "update", organization: organizationData });
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
          } finally {
            setIsSubmitting(false);
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
      });
    } catch (err) {
      console.error("Update failed:", err);
      setErrors({ code: "Có lỗi xảy ra" });
      setIsSubmitting(false);
    }
  };



  const handleDelete = () => {
    if (!organizationData.id) return;

    setAlertinfo({
      isAlertShow: true,
      alertMessage: "Bạn có chắc chắn muốn xóa tổ chức này?",
      type: "warning", // "error" thường dùng cho lỗi, "warning" hợp hơn cho xác nhận
      title: "Xác nhận xóa",
      onConfirm: async () => {
        const result = await deleteData({
          url: `${urlDeleteOrganization}/${organizationData.id}`,
        });

        if (result?.status) {
          onSuccess?.({ action: "delete", organization: organizationData });
          resetForm();
        } else {
          setAlertinfo({
            isAlertShow: true,
            alertMessage: result?.errorCode?.failData?.isSystem === "Cannot delete system records" ? "Không được xóa thông tin hệ thống" : "Xóa tổ chức thất bại",
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
    onSuccess?.({ action: "cancel", organization: organizationData });
  }

  const resetForm = () => {
    setOrganizationData({
      code: "",
      name: "",
      address: "",
      isActive: true
    });
    setErrors({});
    setIsEditing(false);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors &&
    (isEditing ? true : !!organizationData.code);


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
    <div className={styles.container}>
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
        {isEditing ? `Cập nhật tổ chức` : "Thêm tổ chức mới"}
      </h2>}

      {(authorization.add || authorization.update) && <form className={styles.form}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {type === "checkbox" ? (
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={Boolean(organizationData.isActive)}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                id={field}
                name={field}
                value={organizationData[field as keyof Organization] || ""}
                onChange={handleChange}
                placeholder={placeholder}
                className={errors[field as keyof Organization] ? styles.errorInput : ""}
              />
            )}
            {errors[field as keyof Organization] && <span className={styles.error}>{errors[field as keyof Organization]}</span>}
          </div>
        ))}


        <div className={styles.buttonGroup}>
          {!isEditing && authorization.add && (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFormValid || isSubmitting}
              onClick={handleInsert}
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm mới"}
            </button>
          )}

          {isEditing && authorization.update && (
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFormValid || isSubmitting}
              onClick={handleUpdate}
            >
              {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            </button>
          )}

          {isEditing && authorization.delete && (
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

          {isEditing && authorization.viewPrintDesign && (<button
            type="button"
            className={styles.cancelBtn}
            onClick={() => { setIsPrintDesign(true) }}
            disabled={isSubmitting}
          >
            Design print
          </button>
          )}
          {isEditing && authorization.print && (<button
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
      }

      {isPrintDesign && authorization.viewPrintDesign &&
        ReactDOM.createPortal(<div style={{ position: 'fixed', top: '0%', left: 0, width: '100vw', height: '100vh', scale: '0.9', overflowY: 'auto', overflowX: 'auto' }} >
          <DesignPrint
            urlGet="http://localhost:3000/template-contents/organization/list"
            urlUpdate="http://localhost:3000/template-contents/organization/detail"
            urlDelete="http://localhost:3000/template-contents/organization/detail"
            urlInsert="http://localhost:3000/template-contents/organization/detail/insert"
            dynamicTexts={organizationData || {}}
            // contentStateObject={blockOrganization}
            onCancel={handleOnCancel}
            title="Thiết kế mẫu in thông tin tổ chức"
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
            dynamicTexts={organizationData}
            // contentStateObject={blockOrganization}
            urlGet="http://localhost:3000/template-contents/organization/list"
            onCancel={handleOnPrintCancel}
          >
          </PrintPreview>

        </div>, document.body)
      }

    </div>
  );
}