import type { RuleSchema } from "../../../utils/validation";
import { EditFormDefault, EditFormDefaultWithRoot } from "../../utils/GeneralSubject";
import { columnsDepartmentParent, columnsUserSub,columnsRoleSub } from "../FieldComponent/columns";
import ParentComponent from "../FieldComponent/ParentComponent";
import SubComponent from "../FieldComponent/SubComponent";



interface userDepartmentRole {
  id?: string;
  userId?: string;
  departmentId?: string;
  roleId?: string;
}




interface managementFormProps {
  urlCheck: string;
  urlUpdate: string;
  urlDelete: string;
  urlGetPrintContent: string;
  urlUpdatePrintDesign: string;
  urlDeletePrintDesign: string;
  urlInsertPrintDesign: string;

  urlRefreshToken?: string;
  activeData?: userDepartmentRole | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', subject?: userDepartmentRole }) => void;
  authorization: object;
}


const ruleSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  userId: { type: "string", format: "uuid", required: true },
  departmentId: { type: "string", format: "uuid", required: true },
  roleId: { type: "string", format: "uuid", required: true },
  isActive: { type: "boolean", required: true },
};

const fieldLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  userId: { label: "Người dùng", render: (props) => <SubComponent {...props} disabled = {true} urlGet={'http://localhost:3000/auth/user/list'} columns={columnsUserSub} columnsShow={['code', 'name', 'address']} />, type: "custom" },
  departmentId: { label: "Khu vực", render: (props) => <ParentComponent {...props} disabled = {true} urlGet={'http://localhost:3000/auth/department/list'} columns={columnsDepartmentParent} />, type: "custom" },
  roleId: { label: "Vai trò", render: (props) => <SubComponent {...props} disabled = {true} urlGet={'http://localhost:3000/auth/role/list'} columns={columnsRoleSub} />, type: "custom" },
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
}: managementFormProps) {

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
      fieldLabels={fieldLabels}
      ruleSchema={ruleSchema}
      checkFieldExists={[]}
      subjectName="Khu vực"
    />
  );
}