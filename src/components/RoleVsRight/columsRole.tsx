import {
    TextCell,
    DateTimeCell,
    CheckboxCell,
    CountFooter,
} from 'react-table'






const columns = [
    {
        accessorKey: 'code',
        header: 'Mã Vai Trò',
        id: 'code',
        footer: info => `Count: ${CountFooter(info.table)}`,
        cell: TextCell,
    },
    {
        accessorKey: 'name',
        header: 'Tên Vai Trò',
        id: 'name',
        cell: TextCell,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        id: 'description',
        cell: TextCell,
    },
]

export default columns



