import { postData } from "../../../utils/axios";
import type { RuleSchema } from "../../../utils/validation";
import {
    TextCell,
    CountFooter,
    CheckboxCell,
    TextGroupCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'oldCode',
        header: 'Mã khu vực cũ',
        id: 'oldCode',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: 'code',
        header: 'Mã khu vực mới',
        id: 'code',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'name',
        header: 'Tên khu vực',
        id: 'name',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: '_branchCode',
        header: 'Mã chi nhánh',
        id: '_branchCode',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: 'parentId',
        header: 'Mã khu vực cha',
        id: 'parentId',
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
    oldCode: { type: "string", required: true, minLength: 2, maxLength: 100 },
    code: { type: "string", required: false, minLength: 2, maxLength: 100 },
    name: { type: "string", required: false, minLength: 2, maxLength: 255 },
    address: { type: "string", required: false, maxLength: 255 },
    description: { type: "string", required: false, maxLength: 255 },
    _branchCode: { type: "string", required: false, maxLength: 100 },
    parentId: { type: "string", required: false, maxLength: 100 },
    isActive: { type: "boolean", required: false },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/department/check-departments',
        excludeField: 'id',
    },
]

const columnCheckNotExistance = [
    {
        columnNames: {
            oldCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/department/check-departments',

    },
    {
        columnNames: {
            _branchCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/branch/check-branches',

    },

]


const ListIdsConfig = { url: 'http://localhost:3000/auth/department/ids-codes', fieldGet: 'id', fieldGive: 'oldCode', fieldSet: 'code' };

const sheetName = 'Import department'
const fileName = "Departments_update_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Sửa đổi khu vực'

const resolveDataFunction = async (department) => {
    const urlBranchIdCode = 'http://localhost:3000/auth/branch/ids-codes';
    // lấy ra danh sách tất cả brachCode và parentCode trong department
    const branchCodes = Array.from(new Set(department.map(item => item._branchCode).filter(code => code)));
    // Gọi API để lấy về danh sách id và code tương ứng
    const { data: branchIdCodePromise, status: branchIdCodeStatus, errorCode: branchIdCodeError } = await postData({ url: urlBranchIdCode, data: { data: branchCodes } });
    if (!branchIdCodeStatus) {
        return null;
    }
    let newDepartment = department.map(item => {
        const branch = branchIdCodePromise.find(b => b.code === item._branchCode);
        return {
            ...item,
            branchId: branch ? branch.id : null,
        };
    });

    // xóa bỏ branchId = null, undefined, '' trong mỗi phần tử của newDepartment
    newDepartment = newDepartment.map(item => {
        const newItem = { ...item };
        if (newItem.branchId === null || newItem.branchId === undefined || newItem.branchId === '') {
            delete newItem.branchId;
        }
        // kiểm tra nếu parentId = '' thì gán parentId = null
        if (newItem.parentId === '') {
            newItem.parentId = null;
        }

        return newItem;
    });

    // loại bỏ trên newDepartment các cột có tên bắt đầu bằng ký tự _ bất kỳ
    newDepartment = newDepartment.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
            if (key.startsWith('_')) {
                delete newItem[key];
            }
        });
        return newItem;
    });

    return newDepartment
}


export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig };
const setting = {
    columns, ruleSchema, columnCheckExistance, columnCheckNotExistance,
    ListIdsConfig, sheetName, fileName, guideSheet, title, resolveDataFunction
};
export default setting;