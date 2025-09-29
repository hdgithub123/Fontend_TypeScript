import type { RuleSchema } from "../../../utils/validation";
import {EditFormDefault} from "../../GeneralSubject/GeneralSubjectComponent";


interface Organization {
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




interface OrganizationManagementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: Organization | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', organization?: Organization }) => void;
  authorization: object;
}




const organizationSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  address: { type: "string", required: false, maxLength: 255 },
  isActive: { type: "boolean", required: false },
};

const fieldOrganizationLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã Tổ chức (*)", type: "text", placeholder: "Nhập mã tổ chức" },
  name: { label: "Tên Tổ chức (*)", type: "text", placeholder: "Nhập tên tổ chức" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  isActive: { label: "Trạng thái (*)", type: "checkbox" }
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
}: OrganizationManagementFormProps) {

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
      fieldLabels={fieldOrganizationLabels}
      ruleSchema={organizationSchema}
      checkFieldExists={['code']}
      subjectName="Tổ chức"
    />
  );
}