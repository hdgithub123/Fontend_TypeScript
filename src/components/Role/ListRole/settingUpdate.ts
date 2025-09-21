import type { RuleSchema } from "../../../utils/validation";
import {
    ReactTableBasic,
    ReactTableBasicArrowkey,
    ReactTableFull,
    ReactTableFullArrowkey,
    ReactTableNomalArrowkey,
    ReactTablePages,
    SearchDropDown,


    TextCell,
    EditableCell,
    DateCell,
    DateUsCell,
    DateVnCell,
    DateTimeCell,
    DateTimeUsCell,
    DateTimeVnCell,
    NumberCell,
    NumberUsCell,
    NumberVnCell,
    CheckboxCell,

    formatVnDateTime,
    formatUsDateTime,
    formatDateTime,

    CountFooter,
    TextGroupCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'oldCode',
        header: 'Mã tổ chức cũ',
        id: 'oldCode',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'code',
        header: 'Mã tổ chức mới',
        id: 'code',
        filterType: 'text',
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
        // accessorFn: row => row.isActive === true ? "TRUE" : row.isActive === false ? "FALSE" : "",
        header: 'Kích Hoạt',
        id: 'isActive',
        // filterType: 'range',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        enableGlobalFilter: false
    },
]


const ruleSchema: RuleSchema = {
    // id: { type: "string", format: "uuid", required: false },
    oldCode: { type: "string", required: true, minLength: 2, maxLength: 100 },
    code: { type: "string", required: false, minLength: 2, maxLength: 100 },
    name: { type: "string", required: false, minLength: 2, maxLength: 255 },
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
        excludeField: 'id',
    },
]

const columnCheckNotExistance = [
    {
        columnNames: {
            oldCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/organization/check-organizations',

    },

]


const ListIdsConfig = { url: 'http://localhost:3000/auth/organization/ids-codes', fieldGet: 'id', fieldGive: 'oldCode', fieldSet: 'code' };

const sheetName = 'Import Organizations'
const fileName = "organizations_update_template.xlsx"
const guideSheet = 'Hướng dẫn'
const title = 'Sửa đổi tổ chức'


export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig };
const setting = { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig, sheetName, fileName, guideSheet, title };
export default setting;