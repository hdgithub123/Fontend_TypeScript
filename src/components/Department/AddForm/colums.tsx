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
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: ExplandingTextCell,
        aggregatedCell: ExplandingTextCell,
        
    },
    {
        accessorKey: 'name',
        header: 'Tên khu vực',
        id: 'name',
        cell: TextCell,
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        cell: TextCell,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        cell: TextCell,
    },
    // {
    //     accessorKey: 'parentId',
    //     header: 'Thuộc về khu vực',
    //     id: 'parentId',
    //     filterType: 'text',
    //     cell: TextCell,
    // },
    {
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        id: 'createdAt',
        cell: DateTimeCell,
        enableGlobalFilter: false
    },
    {
        accessorKey: 'createdBy',
        header: 'Người tạo',
        id: 'createdBy',
        cell: TextCell,
        enableGlobalFilter: false
    }, {
        accessorKey: 'updatedAt',
        header: 'Ngày cập nhật',
        id: 'updatedAt',
        cell: DateTimeCell,
        enableGlobalFilter: false
    }, {
        accessorKey: 'updatedBy',
        header: 'Người cập nhật',
        id: 'updatedBy',
        cell: TextCell,
        enableGlobalFilter: false
    },
    {
        accessorKey: 'isActive',
        header: 'Kích hoạt',
        id: 'isActive',
        cell: CheckboxCell,
        enableGlobalFilter: false
    },
    {
        accessorKey: 'isSystem',
        header: 'Hệ Thống',
        id: 'isSystem',
        cell: CheckboxCell,
        enableGlobalFilter: false
    },

]

export default columns



