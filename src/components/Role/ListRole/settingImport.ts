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
        header: 'Mã vai trò',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
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
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,

    },
]


const ruleSchema: RuleSchema = {
    //id: { type: "string", format: "uuid", required: false },
    code: { type: "string", required: true, minLength: 2, maxLength: 100 },
    name: { type: "string", required: true, minLength: 2, maxLength: 255 },
    description: { type: "string", required: false, maxLength: 255 },
    // createdAt: { type: "string", format: "datetime", required: false },
    // createdBy: { type: "string", required: false, max: 100 },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/role/check-roles',
    },
]

const columnCheckNotExistance = [


]


const sheetName = 'Import Roles'
const fileName = "Roles_import_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Nhập khẩu Vai Trò'

export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance };




const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance , sheetName, fileName, guideSheet, title };
export default setting;