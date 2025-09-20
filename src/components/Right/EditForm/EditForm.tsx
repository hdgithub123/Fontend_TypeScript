import type { RuleSchema } from "../../../utils/validation";
import { EditFormDefault } from "../../GeneralSubjectComponent";


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


// CREATE TABLE rights (
//     id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
//     name VARCHAR(50) NOT NULL,
//     code VARCHAR(50) UNIQUE NOT NULL, -- Mã quyền có thể thay đổi
//     description TEXT,
//     createdBy VARCHAR(100),
//     updatedBy VARCHAR(100),
//     isSystem TINYINT(1) DEFAULT 0,
//     isOwner TINYINT(1) DEFAULT 0,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     CHECK (id <> '')
// );

const organizationSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  code: { type: "string", required: true, minLength: 2, maxLength: 100 },
  name: { type: "string", required: true, minLength: 2, maxLength: 255 },
  description: { type: "string", required: false, maxLength: 255 },
  isSystem: { type: "boolean", required: false },
  isOwner: { type: "boolean", required: false },
  createdBy: { type: "string", required: false, maxLength: 100 },
  updatedBy: { type: "string", required: false, maxLength: 100 },
  createdAt: { type: "string", format: "datetime", required: false },
  updatedAt: { type: "string", format: "datetime", required: false },
};

const fieldOrganizationLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã Quyền (*)", type: "text", placeholder: "Nhập mã quyền" },
  name: { label: "Tên Quyền (*)", type: "text", placeholder: "Nhập tên quyền" },
  description: { label: "Mô tả", type: "text", placeholder: "Nhập mô tả" },
  // createdBy: { label: "Người tạo", type: "text", placeholder: "Nhập người tạo" },
  // updatedBy: { label: "Người cập nhật", type: "text", placeholder: "Nhập người cập nhật" },
  // createdAt: { label: "Ngày tạo", type: "datetime", placeholder: "Chọn ngày tạo" },
  // updatedAt: { label: "Ngày cập nhật", type: "datetime", placeholder: "Chọn ngày cập nhật" },
  isSystem: { label: "Hệ thống", type: "checkbox" },
  // isOwner: { label: "Chủ sở hữu", type: "checkbox" },
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

  console.log("urlGetPrintContent:", urlGetPrintContent);
  console.log("urlUpdatePrintDesign:", urlUpdatePrintDesign);
  console.log("urlDeletePrintDesign:", urlDeletePrintDesign);
  console.log("urlInsertPrintDesign:", urlInsertPrintDesign);


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
      subjectName="Quyền"
    />
  );
}