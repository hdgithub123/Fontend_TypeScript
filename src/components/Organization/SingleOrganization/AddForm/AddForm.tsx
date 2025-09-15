import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./AddForm.module.scss";
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
  organization?: Organization | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', organization?: Organization }) => void;
  authorization?: object
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
  isActive: { label: "Trạng thái (*)", type: "checkbox" },
};


export default function AddForm({
  urlCheckOrganization = 'http://localhost:3000/auth/organization/check-organization',
  urlInsertOrganization = 'http://localhost:3000/auth/organization/detail/insert',

  organization = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: OrganizationManagementFormProps) {
  const [organizationData, setOrganizationData] = useState<Organization>({});

  const [errors, setErrors] = useState<Partial<Record<keyof Organization, string>>>({});


  // Initialize form with organization data
  useEffect(() => {
    if (organization) {
      // loại bỏ _typeofRow khỏi organization
      const { _typeofRow, ...organizationWithoutTypeofRow } = organization;
      setOrganizationData({
        ...organizationWithoutTypeofRow,
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
  }, [organizationData.code, organizationData.id]);

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
    try {
      if (!validateForm()) {
        return;
      }

      const checkOrganization = { code: organizationData.code, id: organizationData.id };
      const checkResult = await checkOrganizationAvailability({ urlCheckOrganization, organization: checkOrganization });
      const checkErrors: Partial<Organization> = {};
      if (checkResult.code) checkErrors.code = "Tên tổ chức đã tồn tại";

      if (Object.keys(checkErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...checkErrors }));
        return;
      }

      setAlertinfo({
        isAlertShow: true,
        alertMessage: "Bạn có chắc chắn muốn tạo tổ chức mới?",
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          const newId = uuidv4();
          const organizationToCreate: Organization = { ...organizationData, id: newId };
          const result = await postData({
            url: urlInsertOrganization,
            data: organizationToCreate,
          });
          if (result?.status) {
            setOrganizationData(organizationToCreate);
            onSuccess?.({ action: "insert", organization: result.data });
          }
        },
        onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
      });
    } catch (err) {
      console.error("Insert failed:", err);
      setErrors({ code: "Có lỗi xảy ra" });
    }
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
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors &&
    (!!organizationData.code && !!organizationData.password);


  const [alertinfo, setAlertinfo] = useState<AlertInfo>({
    isAlertShow: false,
    alertMessage: '',
    type: 'error',
    title: 'Lỗi',
    showConfirm: true,
    showCancel: true
  });



  return (
    <div className={styles.organizationManagementContainer}>
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
        Thêm người dùng mới
      </h2>}

      {(authorization.add) && <form className={styles.organizationForm}>
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
          {authorization.add && (
            <button
              type="submit"
              className={styles.submitBtn}
              // disabled={!isFormValid}
              onClick={handleInsert}
            >
              Add
            </button>
          )}
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={cancelForm}
          >
            Cancel
          </button>
        </div>
      </form>
      }
    </div>
  );
}