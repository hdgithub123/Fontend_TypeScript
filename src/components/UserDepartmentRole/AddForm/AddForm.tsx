import type { RuleSchema } from "../../../utils/validation";
import { AddFormDefault } from "../../utils/GeneralSubject";
import { columnsDepartmentParent, columnsRoleSub, columnsUserSub } from "../FieldComponent/columns";
import ParentComponent from "../FieldComponent/ParentComponent";
import SubComponent from "../FieldComponent/SubComponent";


// const sqlQuery = `SELECT udr.id as id, udr.userId as userId, u.code as _userCode, u.name as _userName, d.id as departmentId, d.code as _departmentCode, d.name as _departmentName, r.id as roleId, r.code as _roleCode, r.name as _roleName,

interface userDepartmentRole {
  id?: string;
  userId?: string;
  departmentId?: string;
  roleId?: string;
}




interface managementFormProps {
  urlCheck?: string;
  urlInsert?: string;
  activeData?: userDepartmentRole | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', subject?: userDepartmentRole }) => void;
  authorization?: object
}




const roleSchema: RuleSchema = {
  id: { type: "string", format: "uuid", required: false },
  userId: { type: "string", format: "uuid", required: true },
  departmentId: { type: "string", format: "uuid", required: true },
  roleId: { type: "string", format: "uuid", required: true },
  isActive: { type: "boolean", required: true },
};


const fieldRoleLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  userId: { label: "Người dùng", render: (props) => <SubComponent {...props} urlGet={'http://localhost:3000/auth/user/list'} columns={columnsUserSub} columnsShow={['code', 'name', 'address']}/>, type: "custom" },
  departmentId: { label: "Khu vực", render: (props) => <ParentComponent {...props} urlGet={'http://localhost:3000/auth/department/list'} columns={columnsDepartmentParent} />, type: "custom" },
  roleId: { label: "Vai trò", render: (props) => <SubComponent {...props} urlGet={'http://localhost:3000/auth/role/list'} columns={columnsRoleSub} />, type: "custom" },
  isActive: { label: "Kích hoạt", type: "checkbox" },
};


export default function AddForm({
  urlCheck,
  urlInsert,
  activeData = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: managementFormProps) {

  return (
    <AddFormDefault
      urlCheck={urlCheck}
      urlInsert={urlInsert}
      activeData={activeData}
      onSuccess={onSuccess}
      authorization={authorization}
      fieldLabels={fieldRoleLabels}
      ruleSchema={roleSchema}
      checkFieldExists={[]}
      checkFieldNoExists={[]}
      subjectName="phân vai trò khu vực người dùng"
    />
  );
}


