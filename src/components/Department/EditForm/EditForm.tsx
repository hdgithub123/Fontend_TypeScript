import type { RuleSchema } from "../../../utils/validation";
import {EditFormDefault} from "../../GeneralSubjectTreeComponent";


interface department {
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  description?: string;
  parentId?: string | null;
  branchId?: string;
  isActive?: boolean;
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}


interface DepartmentManagementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: department | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', department?: department }) => void;
  authorization: object;
}




const departmentSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  description: { type: "string", required: false, maxLength: 255 },
  parentId: { type: "string", format: "uuid", required: false },
  branchId: { type: "string", format: "uuid", required: true },
  isActive: { type: "boolean", required: false },
  isSystem: { type: "boolean", required: false },
  createdBy: { type: "string", required: false, maxLength: 100 },
  updatedBy: { type: "string", required: false, maxLength: 100 },
  createdAt: { type: "string", format: "datetime", required: false },
  updatedAt: { type: "string", format: "datetime", required: false },
};

const fieldDepartmentLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã khu vực (*)", type: "text", placeholder: "Nhập mã khu vực" },
  name: { label: "Tên khu vực (*)", type: "text", placeholder: "Nhập tên khu vực" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  description: { label: "Mô tả", type: "text", placeholder: "Nhập mô tả" },
  branchId: { label: "Chi nhánh (*)", type: "text" },
  parentId: { label: "Phòng ban cha", type: "text" },
  isActive: { label: "Kích hoạt", type: "checkbox" },
};


export default function EditForm({
  urlCheck,
  urlUpdate,
  urlDelete,

  urlGetPrintContent,
  urlUpdatePrintDesign,
  urlDeletePrintDesign,
  urlInsertPrintDesign,

  activeData = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: DepartmentManagementFormProps) {

  return (
    <EditFormDefault
      urlCheck={urlCheck}
      urlUpdate={urlUpdate}
      urlDelete={urlDelete}
      urlGetPrintContent={urlGetPrintContent}
      urlUpdatePrintDesign={urlUpdatePrintDesign}
      urlDeletePrintDesign={urlDeletePrintDesign}
      urlInsertPrintDesign={urlInsertPrintDesign}
      activeData={activeData}
      onSuccess={onSuccess}
      authorization={authorization}
      fieldLabels={fieldDepartmentLabels}
      ruleSchema={departmentSchema}
      checkFieldExists={['code']}
      subjectName="Khu vực"
    />
  );
}