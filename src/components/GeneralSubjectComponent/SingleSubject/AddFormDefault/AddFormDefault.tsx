import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./AddFormDefault.module.scss";
import { validateDataArray, messagesVi } from "../../../../utils/validation";
import type { RuleSchema } from "../../../../utils/validation";
import { postData, deleteData, putData, getAuthHeaders } from "../../../../utils/axios/index";
import { AlertDialog, type AlertInfo } from '../../../../utils/AlertDialog';
import { v4 as uuidv4 } from 'uuid';
import checkFieldsAvailability from "../checkFieldsAvailability";



interface Subject {
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  isActive?: boolean | string | number; // Allow boolean, string, or number
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}




interface SubjectManagementFormProps {
  urlCheck?: string;
  urlInsert?: string;
  fieldLabels: Record<string, { label: string; type: string; placeholder?: string }>;
  ruleSchema: RuleSchema;
  checkFieldExists?: string[];
  checkFieldNoExists?: string[];
  activeData?: Subject | null; // Changed from initialSubject to subject
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', subject?: Subject }) => void;
  authorization?: object;
  subjectName?: string;
}



export default function AddFormDefault({
  urlCheck,
  urlInsert,
  activeData = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {},

  fieldLabels = {},
  ruleSchema = {},
  checkFieldExists = [],
  checkFieldNoExists = [],
  subjectName = "",
}: SubjectManagementFormProps) {

  const [subjectData, setSubjectData] = useState<Subject>({});
  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>({});

  // kiểm tra nếu fieldLabels hoặc ruleSchema rỗng thì return
  if (Object.keys(fieldLabels).length === 0 || Object.keys(ruleSchema).length === 0) {
    return null;
  }

  // Initialize form with subject data
  useEffect(() => {
    if (activeData) {
      // loại bỏ _typeofRow khỏi subject
      const { _typeofRow, ...subjectWithoutTypeofRow } = activeData;
      setSubjectData({
        ...subjectWithoutTypeofRow,
      });

    } else {
      resetForm();
    }
  }, [activeData]);


  useEffect(() => {
    const timer = setTimeout(async () => {
      const newErrors = await checkFieldsAvailability({
        data: subjectData,
        urlCheck,
        fieldExists: checkFieldExists,
        fieldNoExists: checkFieldNoExists,
        idField: "id"
      });

      setErrors(prev => ({ ...prev, ...newErrors }));
    }, 300);

    return () => clearTimeout(timer);
  }, [subjectData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setSubjectData(prev => ({ ...prev, [name]: val }));

    const singleFieldData = { [name]: val };
    const result = validateDataArray([singleFieldData], ruleSchema, messagesVi);

    setErrors(prev => ({
      ...prev,
      [name]: result.status ? "" : (result.results[0]?.errors?.[name] || "")
    }));
  };

  const validateForm = () => {
    const result = validateDataArray([subjectData], ruleSchema, messagesVi);
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

      const newErrors = await checkFieldsAvailability({
        data: subjectData,
        urlCheck,
        fieldExists: checkFieldExists,
        fieldNoExists: checkFieldNoExists,
        idField: "id"
      });
      if (Object.keys(newErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newErrors }));
        return;
      }
      setAlertinfo({
        isAlertShow: true,
        alertMessage: `Bạn có chắc chắn muốn tạo ${subjectName} mới?`,
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          const newId = uuidv4();
          const subjectToCreate: Subject = { ...subjectData, id: newId };
          const result = await postData({
            url: urlInsert,
            data: subjectToCreate,
          });
          console.log("Insert result:", result);

          if (result?.status) {
            setSubjectData(subjectToCreate);
            onSuccess?.({ action: "insert", subject: result.data });
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
    onSuccess?.({ action: "cancel", subject: subjectData });
  }

  const resetForm = () => {
    setSubjectData({
      code: "",
      name: "",
      address: "",
      isActive: true
    });
    setErrors({});
  };


  const [alertinfo, setAlertinfo] = useState<AlertInfo>({
    isAlertShow: false,
    alertMessage: '',
    type: 'error',
    title: 'Lỗi',
    showConfirm: true,
    showCancel: true
  });



  return (
    <div className={styles.managementContainer}>
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
        {`Thêm ${subjectName} mới`}
      </h2>}

      {(authorization.add) && <form className={styles.subjectForm}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {type === "checkbox" ? (
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={Boolean(subjectData.isActive)}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                id={field}
                name={field}
                value={subjectData[field as keyof Subject] || ""}
                onChange={handleChange}
                placeholder={placeholder}
                className={errors[field as keyof Subject] ? styles.errorInput : ""}
              />
            )}
            {errors[field as keyof Subject] && <span className={styles.error}>{errors[field as keyof Subject]}</span>}
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


