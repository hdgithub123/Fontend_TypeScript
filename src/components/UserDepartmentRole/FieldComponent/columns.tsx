import { size } from 'mathjs'
import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
    ExplandingTextCell,
} from 'react-table'



const columnsDepartmentParent = [
    {
        accessorKey: 'code',
        header: 'Mã khu vực',
        id: 'code',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: ExplandingTextCell,
        aggregatedCell: ExplandingTextCell,
        size: 150,

    },
    {
        accessorKey: 'name',
        header: 'Tên khu vực',
        id: 'name',
        cell: TextCell,
        size: 150,
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        cell: TextCell,
        size: 20,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        cell: TextCell,
        size: 200,
    },
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


const columnsRoleSub = [
    {
        accessorKey: 'code',
        header: 'Mã vai trò',
        id: 'code',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: ExplandingTextCell,
        aggregatedCell: ExplandingTextCell,
        size: 150,

    },
    {
        accessorKey: 'name',
        header: 'Tên vai trò',
        id: 'name',
        cell: TextCell,
        size: 150,
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        cell: TextCell,
        size: 20,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        cell: TextCell,
        size: 200,
    },
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

const columnsUserSub = [
    {
        accessorKey: 'code',
        header: 'Mã người dùng',
        id: 'code',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: ExplandingTextCell,
        aggregatedCell: ExplandingTextCell,
        size: 150,

    },
    {
        accessorKey: 'name',
        header: 'Tên người dùng',
        id: 'name',
        cell: TextCell,
        size: 150,
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        id: 'address',
        cell: TextCell,
        size: 200,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        cell: TextCell,
        size: 200,
    },
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

export { columnsDepartmentParent, columnsRoleSub, columnsUserSub };



