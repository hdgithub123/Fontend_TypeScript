import {
    TextCell,
    CheckboxCell,
    CountFooter,
    TextGroupCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'code',
        header: 'Mã Quyền',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
    },
    {
        accessorKey: 'name',
        header: 'Tên Quyền',
        id: 'name',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: 'description',
        header: 'Mô Tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,
        groupCell: TextGroupCell,

    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ Thống',
        id: 'isSystem',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },



]

export default columns