import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
} from 'react-table'


// interface department {
//   id?: string;
//   code?: string;
//   name?: string;
//   address?: string;
//   description?: string;
//   parentId?: string | null;
//   branchId?: string;
//   isActive?: boolean;
//   isSystem?: boolean;
//   createdBy?: string;
//   updatedBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }



const columns = [
    {
        accessorKey: 'code',
        header: 'Mã khu vực',
        id: 'code',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
    },
    {
        accessorKey: 'name',
        header: 'Tên khu vực',
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
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: 'parentId',
        header: 'Thuộc về khu vực',
        id: 'parentId',
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
        accessorKey: 'isActive',
        header: 'Kích hoạt',
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

]

export default columns



