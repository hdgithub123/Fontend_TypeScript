import { postData } from "../../../utils/axios";
import type { RuleSchema } from "../../../utils/validation";
import {
    TextCell,
    CheckboxCell,
    CountFooter,
    TextGroupCell,
} from 'react-table'


const columns = [
    {
        accessorKey: '_userCode',
        header: 'Mã người dùng',
        id: '_userCode',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: '_departmentCode',
        header: 'Mã khu vực',
        id: '_departmentCode',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: '_roleCode',
        header: 'Mã vai trò',
        id: '_roleCode',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'isActive',
        header: 'Kích Hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        enableGlobalFilter: true
    },
]


const ruleSchema: RuleSchema = {
    _userCode: { type: "string", required: true, minLength: 2, maxLength: 100 },
    _departmentCode: { type: "string", required: true, minLength: 2, maxLength: 255 },
    _roleCode: { type: "string", required: true, maxLength: 255 },
    isActive: { type: "boolean", required: false },
};




const columnCheckExistance = [
    // {
    //     columnNames: {
    //         _branchCode: 'code',
    //     },
    //     urlCheck: 'http://localhost:3000/auth/branch/check-branches',
    // },

]

const columnCheckNotExistance = [
    {
        columnNames: {
            _userCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/user/check-users',
    },
    {
        columnNames: {
            _departmentCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/department/check-departments',
    },
    {
        columnNames: {
            _roleCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/role/check-roles',
    },
]



const sheetName = 'Import authorization'
const fileName = "authorization_import.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Nhập khẩu phân quyền'

export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance };


const resolveDataFunction = async (data) => {
    const urlUserCode = 'http://localhost:3000/auth/user/ids-codes';
    const urlDepartmentCode = 'http://localhost:3000/auth/department/ids-codes';
    const urlRoleCode = 'http://localhost:3000/auth/role/ids-codes';


    // lấy ra danh sách tất cả userCode
    const userCodes = Array.from(new Set(data.map(item => item._userCode).filter(code => code)));
    const departmentCodes = Array.from(new Set(data.map(item => item._departmentCode).filter(code => code)));
    const roleCodes = Array.from(new Set(data.map(item => item._roleCode).filter(code => code)));


    // Gọi API để lấy về danh sách id và code tương ứng
    const { data: userIdCodePromise, status: userIdCodeStatus, errorCode: userIdCodeError } = await postData({ url: urlUserCode, data: { data: userCodes } });
    const { data: departmentIdCodePromise, status: departmentIdCodeStatus, errorCode: departmentIdCodeError } = await postData({ url: urlDepartmentCode, data: { data: departmentCodes } });
    const { data: roleIdCodePromise, status: roleIdCodeStatus, errorCode: roleIdCodeError } = await postData({ url: urlRoleCode, data: { data: roleCodes } });

    if (!userIdCodeStatus || !departmentIdCodeStatus || !roleIdCodeStatus) {
        return null;
    }


    let newData = data.map(item => {
        const user = userIdCodePromise.find(b => b.code === item._userCode);
        const department = departmentIdCodePromise.find(b => b.code === item._departmentCode);
        const role = roleIdCodePromise.find(b => b.code === item._roleCode);
        return {
            ...item,
            userId: user ? user.id : null,
            departmentId: department ? department.id : null,
            roleId: role ? role.id : null,
        };
    });

    // loại bỏ trên newData các cột có tên bắt đầu bằng ký tự _ bất kỳ
    newData = newData.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
            if (key.startsWith('_')) {
                delete newItem[key];
            }
        });
        return newItem;
    });

    return newData;
}


const setting = {
    columns, ruleSchema, columnCheckExistance, columnCheckNotExistance,
    sheetName, fileName, guideSheet, title,
    resolveDataFunction
};

// const setting = null
export default setting;