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

    formatVnDateTime,
    formatUsDateTime,
    formatDateTime,

    CountFooter,
    TextGroupCell,
} from 'react-table'




const columns = [
    {
        accessorFn: (row, index) => index + 2,
        header: 'Dòng số',
        id: 'STT',
        filterType: 'text',
        cell: TextCell,
        size: '10'
    },
    {
        accessorKey: 'name',
        header: 'Họ và Tên',
        id: 'name',
        filterType: 'text',
        cell: TextCell,

    },
    {
        accessorKey: 'age',
        header: 'Tuổi',
        id: 'age',
        filterType: 'text',
        cell: TextCell,
    },

]

export default columns




const columnsUser = [
    {
        accessorKey: 'Stt',
        accessorFn: (row, index) => index + 1,
        header: 'STT',
        id: 'STT',
        // filterType: 'text',
        cell: TextCell,
        size: '20px'
    },
    {
        accessorKey: 'code',
        header: 'Username',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
        groupCell: TextGroupCell,

    },
    {
        accessorKey: 'name',
        header: 'Full Name',
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
        header: 'Phone',
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
        header: 'Kích Hoạt',
        id: 'isActive',
        //accessorFn: row => row.isActive === undefined ? "" : row.isActive === 0 ? "Không kích hoạt" : "Đã kích hoạt",
        filterType: 'text',
        // cell: (cell)=>{
        //     console.log("cell.getValue()",cell.getValue())
        //     return cell.getValue() === "0" ? "Đã Đạt": "không đạt"
        // },
        cell: TextCell,

        enableGlobalFilter: true
    },
    {
        accessorKey: 'createdAt',
        accessorFn: row => formatDateTime(row.createdAt),
        header: 'Ngày tạo',
        id: 'createdAt',
        filterType: 'dateTime',
        cell: (info) => info.getValue(),
        // cell: DateTimeCell,
        enableGlobalFilter: false
    },
    {
        accessorKey: 'createdBy',
        header: 'Người tạo',
        id: 'createdBy',
        filterType: 'text',
        cell: TextCell,
        enableGlobalFilter: false
    },

]



const userSchema: RuleSchema = {
    id: { type: "string", format: "uuid", required: false },
    code: { type: "string", required: true, min: 2, max: 100 },
    password: { type: "string", required: false, max: 255 },
    name: { type: "string", required: true, min: 2, max: 255 },
    address: { type: "string", required: false, max: 255 },
    email: { type: "string", format: "email", required: true, max: 100 },
    phone: { type: "string", required: false, format: "phone", max: 20 },
    image: { type: "string", required: false, max: 255 },
    isActive: { type: "boolean", required: false },
    // isSystem: { type: "boolean", required: false },
    // createdBy: { type: "string", required: false, max: 100 },
    // updatedBy: { type: "string", required: false, max: 100 },
    // createdAt: { type: "string", format: "datetime", required: false },
    // updatedAt: { type: "string", format: "datetime", required: false }
};


const columnCheckExistance = [
    { columnNames: ['code', 'email'], urlCheck: 'http://localhost:3000/auth/user/check-users' },
]

const columnCheckNotExistance = [
    //{ columnNames: ['code', 'email'], urlCheck: 'http://localhost:3000/auth/user/check-users' },
]

export { columnsUser, userSchema, columnCheckExistance, columnCheckNotExistance }