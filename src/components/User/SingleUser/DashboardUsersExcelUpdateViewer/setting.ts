import type { RuleSchema } from "../../../../utils/validation";
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
        header: 'Tên Đăng Nhập Cũ',
        id: 'oldCode',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'code',
        header: 'Tên Đăng Nhập Mới',
        id: 'code',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'password',
        header: 'Mật Khẩu',
        id: 'password',
        filterType: 'text',
    },
    {
        accessorKey: 'name',
        header: 'Họ Tên',
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
        accessorKey: 'email',
        header: 'Email',
        id: 'email',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'phone',
        header: 'Điện Thoại',
        id: 'phone',
        filterType: 'number',
        cell: TextCell,

    },
    {
        accessorKey: 'image',
        header: 'Avata',
        id: 'image',
        filterType: 'text',
        cell: TextCell,

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
    // {
    //     accessorKey: 'createdAt',
    //     header: 'Ngày tạo',
    //     id: 'createdAt',
    //     filterType: 'dateTime',
    //     cell: DateTimeCell,
    //     enableGlobalFilter: false
    // },
    // {
    //     accessorKey: 'createdBy',
    //     header: 'Người tạo',
    //     id: 'createdBy',
    //     filterType: 'text',
    //     cell: TextCell,
    //     enableGlobalFilter: false
    // },

]


const ruleSchema: RuleSchema = {
    // id: { type: "string", format: "uuid", required: false },
    oldCode: { type: "string", required: true, minLength: 2, maxLength: 100 },
    code: { type: "string", required: false, minLength: 2, maxLength: 100 },
    password: { type: "string", required: false, maxLength: 255 },
    name: { type: "string", required: false, minLength: 2, maxLength: 255 },
    address: { type: "string", required: false, maxLength: 255 },
    email: { type: "string", format: "email", required: false, maxLength: 100 },
    phone: { type: "string", required: false, format: "phone", maxLength: 20 },
    image: { type: "string", required: false, maxLength: 255 },
    isActive: { type: "boolean", required: false },
    // createdAt: { type: "string", format: "datetime", required: false },
    // createdBy: { type: "string", required: false, max: 100 },
};


const columnCheckExistance = [
    {
        columnNames: {
            code: 'code',
            email: 'email',
        },
        urlCheck: 'http://localhost:3000/auth/user/check-users',
        excludeField: 'id',
    },
]

const columnCheckNotExistance = [
    {
        columnNames: {
            oldCode: 'code',
        },
        urlCheck: 'http://localhost:3000/auth/user/check-users',

    },

]


const ListIdsConfig = { url: 'http://localhost:3000/auth/user/ids-codes', fieldGet: 'id', fieldGive: 'oldCode', fieldSet: 'code' };

export { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig };