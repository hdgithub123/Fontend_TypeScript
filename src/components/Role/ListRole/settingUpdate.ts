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
        header: 'Mã vai trò cũ',
        id: 'oldCode',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,

    },
    {
        accessorKey: 'code',
        header: 'Mã vai trò mới',
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
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,

    },
]


const ruleSchema: RuleSchema = {
    oldCode: { type: "string", required: true, minLength: 2, maxLength: 100 },
    code: { type: "string", required: false, minLength: 2, maxLength: 100 },
    name: { type: "string", required: false, minLength: 2, maxLength: 255 },
    description: { type: "string", required: false, maxLength: 255 },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/role/check-roles',
        excludeField: 'id',
    },
]

const columnCheckNotExistance = [
    {
        columnNames: {
            oldCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/role/check-roles',

    },

]


const ListIdsConfig = { url: 'http://localhost:3000/auth/role/ids-codes', fieldGet: 'id', fieldGive: 'oldCode', fieldSet: 'code' };

const sheetName = 'Import Roles'
const fileName = "roles_update_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Sửa đổi vai trò'


export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig };
const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig, sheetName, fileName, guideSheet, title };
export default setting;