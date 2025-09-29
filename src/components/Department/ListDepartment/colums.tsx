import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
    ExplandingTextCell,
} from 'react-table'



const columns = [
    {
        accessorKey: 'code',
        header: 'Mã khu vực',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: ExplandingTextCell,
        aggregatedCell: ExplandingTextCell,
    },
    {
        accessorKey: 'name',
        header: 'Tên khu vực',
        id: 'name',
        filterType: 'text',
        cell: TextCell,
         aggregatedCell: TextCell,
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
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
        accessorKey: '_branchCode',
        header: 'Mã chi nhánh',
        id: '_branchCode',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: '_branchName',
        header: 'Tên chi nhánh',
        id: '_branchName',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        id: 'createdAt',
        filterType: 'dateTime',
        cell: DateTimeCell,
        aggregatedCell: DateTimeCell,
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
        aggregatedCell: DateTimeCell,
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
        accessorKey: 'isActive',
        header: 'Kích hoạt',
        id: 'isActive',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        aggregatedCell: CheckboxCell,
        enableGlobalFilter: false
    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ Thống',
        id: 'isSystem',
        filterType: 'multiSelect',
        cell: CheckboxCell,
        aggregatedCell: CheckboxCell,
        enableGlobalFilter: false
    },

]

export default columns



