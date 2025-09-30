import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./EditFormDefaultWithRoot.module.scss";
import { validateDataArray, messagesVi } from "../../../../../utils/validation";
import type { RuleSchema } from "../../../../../utils/validation";
import { postData, deleteData, putData, getAuthHeaders } from "../../../../../utils/axios/index";
import { AlertDialog, type AlertInfo } from '../../../../../utils/AlertDialog';
import ReactDOM from 'react-dom';
import DesignPrint from "../../../../Print/DesignPrint/DesignPrint";
import PrintPreview from '../../../../Print/PrintPreview/PrintPreview';

import checkFieldsAvailability from "../checkFieldsAvailability";


interface Subject extends Record<string, any> { }




interface SubjectManagementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: Subject | null; // Changed from initialSubject to subject
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', subject?: Subject }) => void;
  authorization: object;

  fieldLabels?: Record<string, { label: string; type: string; placeholder?: string }>;
  ruleSchema?: RuleSchema;
  checkFieldExists?: string[];
  checkFieldNoExists?: string[];
  subjectName?: string;
  fieldCheckNull?: string;
}


export default function EditFormDefaultWithRoot({
  urlCheck,
  urlUpdate,
  urlDelete,

  urlGetPrintContent,
  urlUpdatePrintDesign,
  urlDeletePrintDesign,
  urlInsertPrintDesign,

  activeData = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {},

  fieldLabels = {},
  ruleSchema = {},
  checkFieldExists = [],
  checkFieldNoExists = [],
  fieldCheckNull = 'parentId',
  subjectName = "",

}: SubjectManagementFormProps) {
  const [subjectData, setSubjectData] = useState<Subject>({});
  const [subjectDefaultData, setSubjectDefaultData] = useState<Subject>({});
  const [errors, setErrors] = useState<Partial<Record<keyof Subject, string>>>({});
  // Initialize form with subject data
  useEffect(() => {
    if (activeData) {
      const { _typeofRow, ...subjectWithoutTypeofRow } = activeData;

      setSubjectData({
        ...subjectWithoutTypeofRow,
      });

      setSubjectDefaultData({
        ...subjectWithoutTypeofRow,
      });
    } else {
      resetForm();
    }
  }, [activeData]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (urlCheck || urlCheck !== "") {
        const newErrors = await checkFieldsAvailability({
          data: subjectData,
          urlCheck,
          fieldExists: checkFieldExists,
          fieldNoExists: checkFieldNoExists,
          idField: "id"
        });
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [subjectData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setSubjectData(prev => ({ ...prev, [name]: val }));

    const singleFieldData = { [name]: val };
    let newRuleSchema = { ...ruleSchema };
    if (activeData?.[fieldCheckNull] == null || activeData?.[fieldCheckNull] === '' || activeData?.[fieldCheckNull] === undefined) {
      const { [fieldCheckNull]: removedField, ...rest } = newRuleSchema;
      newRuleSchema = rest;
    }

    const result = validateDataArray([singleFieldData], newRuleSchema, messagesVi);

    setErrors(prev => ({
      ...prev,
      [name]: result.status ? "" : (result.results[0]?.errors?.[name] || "")
    }));
  };

  const validateForm = () => {
    // kiểm tra trong activeData nếu có activeData.parentId = null , undefined, '' thì bỏ parentId khỏi tạo ruleSchema mới bỏ đi parentId
    let newRuleSchema = { ...ruleSchema };
    if (activeData?.[fieldCheckNull] == null || activeData?.[fieldCheckNull] === '' || activeData?.[fieldCheckNull] === undefined) {
      const { [fieldCheckNull]: removedField, ...rest } = newRuleSchema;
      newRuleSchema = rest;
    }

    const result = validateDataArray([subjectData], newRuleSchema, messagesVi);
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
        alertMessage: `Bạn có chắc chắn muốn cập nhật ${subjectName} này?`,
        type: "warning",
        title: "Xác nhận",
        onConfirm: async () => {
          const payload: Partial<Subject> = {
            ...subjectData,
          };

          const updatedFields = Object.keys(payload).reduce((acc, key) => {
            if (
              key === "id" ||
              subjectDefaultData[key as keyof Subject] !== payload[key as keyof Subject]
            ) {
              acc[key as keyof Subject] = payload[key as keyof Subject];
            }
            return acc;
          }, {} as Partial<Subject>);


          const result = await putData({
            url: `${urlUpdate}/${subjectData.id}`,
            data: updatedFields,
          });

          if (result?.status) {
            setSubjectDefaultData(prev => ({ ...prev, ...payload }));
            onSuccess?.({ action: "update", subject: subjectData });
          } else {
            // lặp qua tất cả các lỗi và hiển thị của result?.errorCode?.failData thành một chuỗi
            const errorMessages = Object.entries(result?.errorCode?.failData || {}).map(([key, value]) => `${value}`).join(', ');
            setAlertinfo({
              isAlertShow: true,
              alertMessage: `Có lỗi xảy ra khi cập nhật ${subjectName} này: ${errorMessages} ${result?.errorCode?.sqlMessage || ''}`,
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
      setErrors({ code: "Có lỗi xảy ra" });
    }
  };


  const handleDelete = () => {
    if (!subjectData.id) return;

    setAlertinfo({
      isAlertShow: true,
      alertMessage: `Bạn có chắc chắn muốn xóa ${subjectName} này?`,
      type: "warning",
      title: "Xác nhận xóa",
      onConfirm: async () => {
        const result = await deleteData({
          url: `${urlDelete}/${subjectData.id}`,
        });

        if (result?.status) {
          onSuccess?.({ action: "delete", subject: subjectData });
          resetForm();
        } else {

          // lặp qua tất cả các lỗi và hiển thị của result?.errorCode?.failData thành một chuỗi
          const errorMessages = Object.entries(result?.errorCode?.failData || {}).map(([key, value]) => `${value}`).join(', ');
          setAlertinfo({
            isAlertShow: true,
            alertMessage: result?.errorCode?.failData?.isSystem === "Cannot delete system records" ? "Không được xóa thông tin hệ thống" : `Xóa thất bại: ${errorMessages}`,
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
    onSuccess?.({ action: "cancel", subject: subjectData });
  }

  const resetForm = () => {
    const emptyData: Subject = {};
    Object.keys(fieldLabels).forEach(field => {
      emptyData[field] = fieldLabels[field].type === "checkbox" ? false : "";
    });
    setSubjectData(emptyData);
    setErrors({});
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormValid = !hasErrors


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
        {authorization.update ? `Cập nhật ${subjectName}` : `Thông tin ${subjectName}`}
      </h2>}

      {(authorization.view) && <form className={styles.subjectForm}>
        {Object.entries(fieldLabels).map(([field, { label, type, placeholder, render }]) => (
          <div className={styles.formGroup} key={field}>
            <label htmlFor={field}>{label}:</label>
            {render ? (
              render({
                value: subjectData,
                onChange: handleChange,
                id: field,
                name: field
              })
            ) : type === "checkbox" ? (
              <input
                type="checkbox"
                id={field}
                name={field}
                checked={Boolean(subjectData[field as keyof Subject]) || false}
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
            urlGet={urlGetPrintContent}
            urlUpdate={urlUpdatePrintDesign}
            urlDelete={urlDeletePrintDesign}
            urlInsert={urlInsertPrintDesign}
            dynamicTexts={subjectData || {}}
            // contentStateObject={blockSubject}
            onCancel={handleOnCancel}
            title={`Thiết kế mẫu in thông tin ${subjectName}`}
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
            dynamicTexts={subjectData}
            // contentStateObject={blockSubject}
            urlGet={urlGetPrintContent}
            onCancel={handleOnPrintCancel}
          >
          </PrintPreview>

        </div>, document.body)
      }

    </div>
  );
}