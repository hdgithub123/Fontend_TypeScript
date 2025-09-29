import { im } from "mathjs";
import type { RuleSchema } from "../../../utils/validation";
import {AddFormDefault} from "../../GeneralSubject";
import { columnsParent, columnsSub } from "../FieldComponent/columns";
import ParentComponent from "../FieldComponent/ParentComponent";
import SubComponent from "../FieldComponent/SubComponent";

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




interface roleManagementFormProps {
  urlCheck?: string;
  urlInsert?: string;
  activeData?: department | null; // Changed from initialOrganization to organization
  onSuccess?: (params: { action: 'insert' | 'update' | 'delete' | 'cancel', department?: department }) => void;
  authorization?: object
}




const roleSchema: RuleSchema = {
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

const urlGetBranchList = 'http://localhost:3000/auth/branch/list';
const urlGetParentList = 'http://localhost:3000/auth/department/list';

const fieldRoleLabels: Record<string, { label: string; type: string; placeholder?: string }> = {
  code: { label: "Mã khu vực (*)", type: "text", placeholder: "Nhập mã khu vực" },
  name: { label: "Tên khu vực (*)", type: "text", placeholder: "Nhập tên khu vực" },
  address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
  description: { label: "Mô tả", type: "text", placeholder: "Nhập mô tả" },
  branchId: { label: "Chi nhánh", render: (props) => <SubComponent {...props} urlGet={urlGetBranchList} columns={columnsSub} />, type: "custom" },
  parentId: { label: "Phòng ban cha", render: (props) => <ParentComponent {...props} urlGet={urlGetParentList} columns={columnsParent} />, type: "custom" },
  isActive: { label: "Kích hoạt", type: "checkbox" },

};


export default function AddForm({
  urlCheck,
  urlInsert,
  activeData = null, // Changed parameter name
  onSuccess = () => { },
  authorization = {}
}: roleManagementFormProps) {

  return (
    <AddFormDefault
      urlCheck={urlCheck}
      urlInsert={urlInsert}
      activeData={activeData}
      onSuccess={onSuccess}
      authorization={authorization}
      fieldLabels={fieldRoleLabels}
      ruleSchema={roleSchema}
      checkFieldExists={["code"]}
      checkFieldNoExists={[]}
      subjectName="Khu vực"
    />
  );
}


