import type { RuleSchema } from "../../../utils/validation";
import {
    TextCell,
    CheckboxCell,
    CountFooter,
    TextGroupCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'code',
        header: 'Mã chi nhánh',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: 'name',
        header: 'Tên chi nhánh',
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
        accessorKey: 'isActive',
        header: 'Kích Hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        enableGlobalFilter: true
    },
]


const ruleSchema: RuleSchema = {
    code: { type: "string", required: true, minLength: 2, maxLength: 100 },
    name: { type: "string", required: true, minLength: 2, maxLength: 255 },
    address: { type: "string", required: false, maxLength: 255 },
    description: { type: "string", required: false, maxLength: 255 },
    isActive: { type: "boolean", required: false },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/branch/check-branches',
    },
]

const columnCheckNotExistance = [


]


const sheetName = 'Import Branches'
const fileName = "Branches_import_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Nhập khẩu Chi Nhánh'

export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance };




const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, sheetName, fileName, guideSheet, title };
export default setting;