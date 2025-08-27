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

    CountFooter,
    TextGroupCell,
} from 'react-table'


const columnsContent = [
    {
        accessorKey: 'code',
        header: 'code',
        id: 'code',
        cell: TextCell,
        size: '50%'
    },
    {
        accessorKey: 'name',
        header: 'Name',
        id: 'name',
        cell: TextCell,
        enableGlobalFilter: true        
    },
        {
        accessorKey: 'description',
        header: 'Description',
        id: 'description',
        cell: TextCell,
        enableGlobalFilter: false        
    }
]

export default columnsContent
