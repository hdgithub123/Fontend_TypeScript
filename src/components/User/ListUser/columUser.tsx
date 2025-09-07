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

// import formatDateTime from './formatDateTime'
import convertColumns from '../../MakeReportTable/convertColumns'


// code: { label: "Tên đăng nhập (*)", type: "text", placeholder: "Nhập tên đăng nhập" },
// password: { label: "Mật khẩu (*)", type: "password", placeholder: "Nhập mật khẩu" },
// name: { label: "Họ và tên (*)", type: "text", placeholder: "Nhập họ và tên" },
// address: { label: "Địa chỉ", type: "text", placeholder: "Nhập địa chỉ" },
// email: { label: "Email (*)", type: "email", placeholder: "Nhập email" },
// phone: { label: "Điện thoại", type: "text", placeholder: "Nhập số điện thoại" },
// image: { label: "Avata", type: "text", placeholder: "Nhập Avata link" },
// isActive: { label: "Trạng thái (*)", type: "checkbox" }



const columnsUser = [
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
        // accessorKey: 'isActive',
        header: 'Kích Hoạt',
        id: 'isActive',
        accessorFn: row => row.isActive === undefined ? "" : row.isActive === 0 ? "Không kích hoạt" : "Đã kích hoạt",
        filterType: 'text',
        // cell: (cell)=>{
        //     console.log("cell.getValue()",cell.getValue())
        //     return cell.getValue() === "0" ? "Đã Đạt": "không đạt"
        // },
        cell: TextCell,

        enableGlobalFilter: false
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

// gác lại sau làm
// const columnsUserString = [
//     {
//         accessorKey: 'username',
//         header: 'Username',
//         id: 'username',
//         filterType: 'text',
//         footer: "CountFooter('Số dòng:')",
//         cell: "TextCell",
//         groupCell: "TextGroupCell",

//     },
//     {
//         accessorKey: 'fullName',
//         header: 'Full Name',
//         id: 'fullName',
//         filterType: 'text',
//         cell: "TextCell",
//         groupCell: "TextGroupCell",

//     },
//     {
//         accessorKey: 'email',
//         header: 'Email',
//         id: 'email',
//         filterType: 'text',
//         cell: "TextCell",

//     },
//     {
//         accessorKey: 'phone',
//         header: 'Phone',
//         id: 'phone',
//         filterType: 'number',
//         cell: "TextCell",

//     },
//         {
//         accessorKey: 'isActive',
//         header: 'Kích Hoạt',
//         id: 'isActive',
//         accessorFn: `row => row.isActive === undefined ? "": row.isActive === 0 ?"Không kích hoạt": "Đã kích hoạt"`,
//         filterType: 'text',
//         // cell: (cell)=>{
//         //     console.log("cell.getValue()",cell.getValue())
//         //     return cell.getValue() === "0" ? "Đã Đạt": "không đạt"
//         // },
//         cell: 'TextCell',

//         enableGlobalFilter: false
//     },
//             {
//         accessorKey: 'createdAt',
//         // accessorFn: 'row => formatDateTime(row.createdAt)',
//         header: 'Ngày tạo',
//         id: 'createdAt',
//         filterType: 'dateTime',
//         cell: 'DateTimeCell',
//         enableGlobalFilter: false
//     },
//             {
//         accessorKey: 'createdBy',
//         header: 'Người tạo',
//         id: 'createdBy',
//         filterType: 'text',
//         cell: 'TextCell',
//         enableGlobalFilter: false
//     },

// ]
// const columnsUser2 = convertColumns(columnsUserString)

export default columnsUser
