import type { RuleSchema } from "../../../../../utils/validation";
import {
    TextCell,
    CheckboxCell,
    CountFooter,
    TextGroupCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'code',
        header: 'Mã tổ chức',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: 'name',
        header: 'Tên tổ chức',
        id: 'name',
        filterType: 'text',
        cell: TextCell,
        groupCell: TextGroupCell,

    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        filterType: 'text',
        cell: TextCell,
        groupCell: TextGroupCell,

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
    //id: { type: "string", format: "uuid", required: false },
    code: { type: "string", required: true, minLength: 2, maxLength: 100 },
    name: { type: "string", required: true, minLength: 2, maxLength: 255 },
    address: { type: "string", required: false, maxLength: 255 },
    isActive: { type: "boolean", required: false },
    // createdAt: { type: "string", format: "datetime", required: false },
    // createdBy: { type: "string", required: false, max: 100 },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/organization/check-organizations',
    },
]

const columnCheckNotExistance = [


]


const sheetName = 'Import Organizations'
const fileName = "organizations_import_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Import Organizations'

export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance };




const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance , sheetName, fileName, guideSheet, title };
export default setting;