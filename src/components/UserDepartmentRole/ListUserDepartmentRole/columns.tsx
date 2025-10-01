import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
    ExplandingTextCell,
} from 'react-table'

// SELECT udr.id as id, udr.userId as userId, u.code as userCode, u.name as userName, d.id as departmentId, d.code as departmentCode, d.name as departmentName, r.id as roleId, r.code as roleCode, r.name as roleName

const columns = [
    {
        accessorKey: '_userCode',
        header: 'Mã người dùng',
        id: '_userCode',
        filterType: 'text',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
    },
    {
        accessorKey: '_userName',
        header: 'Tên người dùng',
        id: '_userName',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: '_departmentCode',
        header: 'Mã phòng ban',
        id: '_departmentCode',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: '_departmentName',
        header: 'Tên phòng ban',
        id: '_departmentName',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: '_roleCode',
        header: 'Mã vai trò',
        id: '_roleCode',
        filterType: 'text',
        cell: TextCell,
    },
    {
        accessorKey: '_roleName',
        header: 'Tên vai trò',
        id: '_roleName',
        filterType: 'text',
        cell: TextCell,
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
    },{
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

]


const columnsShow = ['_userCode', '_userName', '_departmentCode', '_departmentName', '_roleCode', '_roleName', 'isActive'];

export default columns
export {
    columnsShow
}


