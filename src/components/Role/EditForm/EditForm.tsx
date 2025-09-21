import type { RuleSchema } from "../../../utils/validation";
import {EditFormDefault} from "../../GeneralSubjectComponent";


interface role {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  isSystem?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}




interface RoleManagementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: role | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', role?: role }) => void;
  authorization: object;
}




const roleSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  description: { type: "string", required: false, maxLength: 255 },
  isSystem: { type: "boolean", required: false },
  createdBy: { type: "string", required: false, maxLength: 100 },
  updatedBy: { type: "string", required: false, maxLength: 100 },
  createdAt: { type: "string", format: "datetime", required: false },
  updatedAt: { type: "string", format: "datetime", required: false },
};

const fieldRoleLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã Vai trò (*)", type: "text", placeholder: "Nhập mã vai trò" },
  name: { label: "Tên Vai trò (*)", type: "text", placeholder: "Nhập tên vai trò" },
  description: { label: "Mô tả", type: "text", placeholder: "Nhập mô tả" },
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
}: RoleManagementFormProps) {

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
      ruleSchema={roleSchema}
      checkFieldExists={['code']}
      subjectName="Vai trò"
    />
  );
}