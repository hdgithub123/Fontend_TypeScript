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

    CountFooter,
    TextGroupCell,
} from 'react-table'

import formatDateTime from './formatDateTime'


const columnsUser = [
    {
        accessorKey: 'username',
        header: 'Username',
        id: 'username',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
        groupCell: TextGroupCell,
        
    },
    {
        accessorKey: 'fullName',
        header: 'Full Name',
        id: 'fullName',
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
        accessorKey: 'isActive',
        header: 'Kích Hoạt',
        id: 'isActive',
        accessorFn: row => row.isActive === undefined ? "": row.isActive === 0 ?"Không kích hoạt": "Đã kích hoạt",
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

export default columnsUser
