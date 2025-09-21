import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
    TextGroupCell,
} from 'react-table'


const columns = [
    {
        accessorKey: 'code',
        header: 'Mã Tổ Chức',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
    },
    {
        accessorKey: 'name',
        header: 'Tên Tổ Chức',
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
        groupCell: TextGroupCell,

    },
    {
        accessorKey: 'isActive',
        header: 'Kích Hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ Thống',
        id: 'isSystem',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },
    {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        id: 'createdAt',
        filterType: 'dateTime',
        cell: DateTimeCell,
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

export default columns



