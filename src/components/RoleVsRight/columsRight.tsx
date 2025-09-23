import {
    TextCell,
    CheckboxCell,
    EditableCheckboxCell,
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
        accessorKey: 'isActive',
        header: 'Kích hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: EditableCheckboxCell,

        enableGlobalFilter: false
    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ thống',
        id: 'isSystem',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },
]



const columnsAssign = [
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
        accessorKey: 'isActive',
        header: 'Kích hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ thống',
        id: 'isSystem',
        filterType: 'multiSelect',
        cell: CheckboxCell,

        enableGlobalFilter: false
    },
]



export {
    columns, 
    columnsAssign
}