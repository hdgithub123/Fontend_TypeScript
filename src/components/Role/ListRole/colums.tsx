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
        header: 'Mô tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,
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
    }, {
        accessorKey: 'updatedAt',
        header: 'Ngày cập nhật',
        id: 'updatedAt',
        filterType: 'dateTime',
        cell: DateTimeCell,
        enableGlobalFilter: false
    }, {
        accessorKey: 'updatedBy',
        header: 'Người cập nhật',
        id: 'updatedBy',
        filterType: 'text',
        cell: TextCell,
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

]

export default columns



