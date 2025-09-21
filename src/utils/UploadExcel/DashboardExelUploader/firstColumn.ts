import {
    TextCell,
} from 'react-table'

const firstColumn = {
    accessorKey: 'Stt',
    accessorFn: (row, index) => index + 2,
    header: '*',
    id: 'STT',
    // filterType: 'text',
    cell: TextCell,
    size: '20'
}

export default firstColumn