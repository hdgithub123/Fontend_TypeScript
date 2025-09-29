import type { RuleSchema } from "../../../utils/validation";
import {EditFormDefault} from "../../GeneralSubject/GeneralSubjectComponent";


interface branch {
  id?: string;
  code?: string;
  name?: string;
  address?: string;
  description?: string;
  isIndependent?: boolean;
  isActive?: boolean;
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}




interface BranchManagementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: branch | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', branch?: branch }) => void;
  authorization: object;
}




const branchSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  description: { type: "string", required: false, maxLength: 255 },
  isIndependent: { type: "boolean", required: false },
  isActive: { type: "boolean", required: false },
  isSystem: { type: "boolean", required: false },
  createdBy: { type: "string", required: false, maxLength: 100 },
  updatedBy: { type: "string", required: false, maxLength: 100 },
  createdAt: { type: "string", format: "datetime", required: false },
  updatedAt: { type: "string", format: "datetime", required: false },
};

const fieldRoleLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã chi nhánh (*)", type: "text", placeholder: "Nhập mã chi nhánh" },
  name: { label: "Tên chi nhánh (*)", type: "text", placeholder: "Nhập tên chi nhánh" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  description: { label: "Mô tả", type: "text", placeholder: "Nhập mô tả" },
  isIndependent: { label: "Chi nhánh độc lập", type: "checkbox" },
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
}: BranchManagementFormProps) {

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
      fieldLabels={fieldRoleLabels}
      ruleSchema={branchSchema}
      checkFieldExists={['code']}
      subjectName="Chi nhánh"
    />
  );
}