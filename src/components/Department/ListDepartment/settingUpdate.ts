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
        header: 'Mã chi nhánh cũ',
        id: 'oldCode',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: 'code',
        header: 'Mã chi nhánh mới',
        id: 'code',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'name',
        header: 'Tên vai trò',
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
        accessorKey: 'isIndependent',
        header: 'Chi nhánh độc lập',
        id: 'isIndependent',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        enableGlobalFilter: true
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
    isIndependent: { type: "boolean", required: false },
    isActive: { type: "boolean", required: false },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/branch/check-branches',
        excludeField: 'id',
    },
]

const columnCheckNotExistance = [
    {
        columnNames: {
            oldCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/branch/check-branches',

    },

]


const ListIdsConfig = { url: 'http://localhost:3000/auth/branch/ids-codes', fieldGet: 'id', fieldGive: 'oldCode', fieldSet: 'code' };

const sheetName = 'Import Branches'
const fileName = "Branches_update_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Sửa đổi chi nhánh'


export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig };
const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig, sheetName, fileName, guideSheet, title };
export default setting;