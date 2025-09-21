import React, { useState } from 'react';
import convertColumns from './convertColumns';
import { v4 as uuidv4 } from 'uuid';

const filterTypes = [
  'text', 'number', 'date', 'dateTime', 'range', 'checkbox', 'multiSelect', 'none'
];

const footerTypes = [
  'SumFooter', 'AverageFooter', 'CountFooter'
];

const cellTypes = [
  'TextCell', 'DateCell', 'DateUsCell', 'DateVnCell',
  'DateTimeCell', 'DateTimeUsCell', 'DateTimeVnCell',
  'NumberCell', 'NumberUsCell', 'NumberVnCell'
];

const numberCells = ['NumberCell', 'NumberUsCell', 'NumberVnCell'];

const aggregationFns = [
  'sum', 'min', 'max', 'extent', 'mean', 'median', 'unique', 'uniqueCount', 'count'
];

const columnDefault = ['username', 'email', 'phone']

// gác lại để làm sau
export default function MakeReportColumnTable({ columnStart = columnDefault }) {
  const [currentFooter, setCurrentFooter] = useState<object>({
    name: '',
    startString: '',
    minFractionDigits: 0,
    maxFractionDigits: 2,
    option: {
      style: "decimal",
      unit: '',
    }
  });

  const [currentCell, setCurrentCell] = useState<object>({
    name: '',
    minFractionDigits: 0,
    maxFractionDigits: 2,
    option: {
      style: "decimal",
      unit: '',
    }
  });

  const [columns, setColumns] = useState<any[]>([]);
  const [newColumn, setNewColumn] = useState<any>({
    id: '',
    // accessorKey: '',
    accessorFn: '',
    header: '',
    filterType: 'text',
    footer: '',
    cell: '',
    groupCell: '',
    aggregatedCell: '',
    aggregationFn: 'sum',
    enableGlobalFilter: true,
  });

  const handleAddColumn = () => {
    if (!newColumn.header) return;
    console.log("currentFooter", currentFooter)

    const columnToAdd = {
      ...newColumn,
      footer: generateFooterString(currentFooter),
      accessorFn: generateAccessorFnFunctionString(newColumn.accessorFn),
      cell: generateCellString(currentCell),
      id: uuidv4(),
    };

    setColumns([...columns, columnToAdd]);

    setNewColumn({
      id: '',
      // accessorKey: '',
      accessorFn: '',
      header: '',
      filterType: 'text',
      footer: '',
      cell: '',
      groupCell: '',
      aggregatedCell: '',
      aggregationFn: 'sum',
      enableGlobalFilter: true,
    });
  };



  const handleAccessorFn = (e) => {
    setNewColumn({ ...newColumn, accessorFn: e.target.value })
  }



  return (
    <div style={{ padding: 20 }}>
      <h2>🛠️ Tạo cấu hình ColumnConfig</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input
          placeholder="AccessorFn"
          value={newColumn.accessorFn}
          onChange={handleAccessorFn}
        />
        <input
          placeholder="Header"
          value={newColumn.header}
          onChange={e => setNewColumn({ ...newColumn, header: e.target.value })}
        />
        <div>
          <label>filterType</label>
          <select
            value={newColumn.filterType}
            onChange={e => setNewColumn({ ...newColumn, filterType: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dateTime">DateTime</option>
            <option value="range">range</option>
            <option value="checkbox">checkbox</option>
            <option value="multiSelect">multiSelect</option>
          </select>
        </div>
        {/* <div>
          <label>footer</label>
          <select
            value={currentFooter.function}
            onChange={e => setCurrentFooter({ ...currentFooter, name: e.target.value })}
          >
            {footerTypes.map(type => <option key={type}>{type}</option>)}
          </select>
          <input
            placeholder="footer Start"
            value={currentFooter.startString}
            onChange={e => setCurrentFooter({ ...currentFooter, startString: e.target.value })}
          />
        </div> */}

        <div style={{ border: '1px solid #ccc', padding: 10 }}>
          <label><strong>⚙️ Footer Config</strong></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <select
              value={currentFooter.name}
              onChange={e => setCurrentFooter({ ...currentFooter, name: e.target.value })}
            >
              <option value="">-- Chọn hàm footer --</option>
              {footerTypes.map(type => <option key={type}>{type}</option>)}
            </select>

            <input
              placeholder="Tiền tố hiển thị (startString)"
              value={currentFooter.startString}
              onChange={e => setCurrentFooter({ ...currentFooter, startString: e.target.value })}
            />

            <input
              type="number"
              placeholder="Min Fraction Digits"
              value={currentFooter.minFractionDigits}
              onChange={e => setCurrentFooter({ ...currentFooter, minFractionDigits: Number(e.target.value) })}
            />

            <input
              type="number"
              placeholder="Max Fraction Digits"
              value={currentFooter.maxFractionDigits}
              onChange={e => setCurrentFooter({ ...currentFooter, maxFractionDigits: Number(e.target.value) })}
            />

            <select
              value={currentFooter.option?.style || ''}
              onChange={e => setCurrentFooter({
                ...currentFooter,
                option: {
                  ...currentFooter.option,
                  style: e.target.value
                }
              })}
            >
              <option value="">-- Style --</option>
              <option value="decimal">decimal</option>
              <option value="percent">percent</option>
              <option value="currency">currency</option>
              <option value="unit">unit</option>
            </select>

            <input
              placeholder="Unit (ví dụ: VND, USD)"
              value={currentFooter.option?.unit || ''}
              onChange={e => setCurrentFooter({
                ...currentFooter,
                option: {
                  ...currentFooter.option,
                  unit: e.target.value
                }
              })}
            />
          </div>
        </div>


        <select
          value={currentCell.name}
          onChange={e => setCurrentCell({ ...newColumn, name: e.target.value })}
        >
          <option value="">-- Cell --</option>
          {cellTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* {numberCells.includes(newColumn.cell) && ( */}
        <div style={{ marginTop: '8px' }}>
          <label>
            Min Fraction Digits:
            <input
              type="number"
              value={currentCell.minFractionDigits ?? ''}
              onChange={e =>
                setCurrentCell({ ...currentCell, minFractionDigits: Number(e.target.value) })
              }
              style={{ marginLeft: '8px', width: '60px' }}
            />
          </label>
          <label style={{ marginLeft: '16px' }}>
            Max Fraction Digits:
            <input
              type="number"
              value={currentCell.maxFractionDigits ?? ''}
              onChange={e =>
                setCurrentCell({ ...currentCell, maxFractionDigits: Number(e.target.value) })
              }
              style={{ marginLeft: '8px', width: '60px' }}
            />
          </label>
        </div>
        {/* )} */}

        <select
          value={newColumn.groupCell}
          onChange={e => setNewColumn({ ...newColumn, groupCell: e.target.value })}
        >
          <option value="">-- Group Cell --</option>
          {cellTypes.map(type => <option key={type}>{type}</option>)}
        </select>

        <select
          value={newColumn.aggregatedCell}
          onChange={e => setNewColumn({ ...newColumn, aggregatedCell: e.target.value })}
        >
          <option value="">-- Aggregated Cell --</option>
          {cellTypes.map(type => <option key={type}>{type}</option>)}
        </select>


        <select
          value={newColumn.aggregationFn}
          onChange={e => setNewColumn({ ...newColumn, aggregationFn: e.target.value })}
        >
          <option value="">-- aggregationFn --</option>
          <option value="sum">sum</option>
          <option value="min">min</option>
          <option value="maxextent">maxextent</option>
          <option value="mean">mean</option>
          <option value="median">median</option>
          <option value="unique">unique</option>
          <option value="uniqueCount">uniqueCount</option>
          <option value="count">count</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={newColumn.enableGlobalFilter}
            onChange={e => setNewColumn({ ...newColumn, enableGlobalFilter: e.target.checked })}
          />
          Global Filter
        </label>
      </div>

      <button onClick={handleAddColumn} style={{ marginTop: 10 }}>➕ Thêm cột</button>

      <h3 style={{ marginTop: 20 }}>📦 Cấu hình hiện tại:</h3>
      <pre style={{ background: '#f0f0f0', padding: 10 }}>
        {JSON.stringify(columns, null, 2)}
      </pre>
    </div>
  );
}

const generateAccessorFnFunctionString = (text) => {
  let expression
  try {
    expression = text.replace(/{{\.?([a-zA-Z0-9_]+)}}/g, (_, key) => `row.${key}`);
  } catch (error) {
    expression = text
  }
  return `(row) => \`${expression}\``;
};


const generateFooterString = (footerConfig) => {
  const { name, startString, minFractionDigits, maxFractionDigits, option } = footerConfig;
  if (!name || name === "") {
    return null
  }

  if (name === 'CountFooter') {
    return `${name}('${startString}')`;
  }

  const style = option?.style;
  const unit = option?.unit;

  // Nếu style là 'decimal' → bỏ style và unit
  if (style === 'decimal') {
    return `${name}('${startString}', ${minFractionDigits}, ${maxFractionDigits})`;
  }

  // Nếu style là 'percent' → giữ style, bỏ unit
  if (style === 'percent') {
    return `${name}('${startString}', ${minFractionDigits}, ${maxFractionDigits}, '${style}')`;
  }

  // Các style khác → giữ cả style và unit
  return `${name}('${startString}', ${minFractionDigits}, ${maxFractionDigits}, '${style}', '${unit}')`;
};


const generateCellString = (cellConfig) => {
  const { name, minFractionDigits, maxFractionDigits } = cellConfig;

  const numberCells = ['NumberCell', 'NumberUsCell', 'NumberVnCell'];

  if (numberCells.includes(name)) {
    return `${name}(${minFractionDigits}, ${maxFractionDigits})`;
  }

  return name;
};

const columnConfigs22: ColumnConfig[] = [
  {
    id: 'amount',
    accessorKey: 'amount',
    accessorFn: '(row) => row.amount*2', // hoặc có thể là "row => row.amount"
    header: 'Số tiền',
    filterType: 'number',
    footer: "SumFooter('Tổng:', 0, 2, 'currency', 'usd')",
    cell: "NumberCell(0,2,'currency','usd')",
    groupCell: "NumberCell(0,2,'currency','usd')",
    aggregatedCell: "NumberCell(0,2,'currency','usd')",
    aggregationFn: 'sum',
    enableGlobalFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    accessorFn: '',
    header: 'Ngày tạo',
    filterType: 'date',
    footer: "CountFooter('Số dòng:')",
    cell: "DateVnCell",
    groupCell: "DateVnCell",
    aggregatedCell: "DateVnCell",
    aggregationFn: 'count',
    enableGlobalFilter: false
  },
  {
    id: 'note',
    accessorKey: 'note',
    accessorFn: '',
    header: 'Ghi chú',
    filterType: 'text',
    footer: "CountFooter('Tổng ghi chú:')",
    cell: "TextCell",
    groupCell: "TextCell",
    aggregatedCell: "TextCell",
    aggregationFn: 'uniqueCount',
    enableGlobalFilter: true
  }
];


const columnsUser = [
  {
    accessorKey: 'username',
    header: 'Username',
    id: 'username',
    filterType: 'text',
    footer: "CountFooter('Số dòng:')",
    cell: "TextCell",
    groupCell: "TextGroupCell",

  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
    id: 'fullName',
    filterType: 'text',
    cell: "TextCell",
    groupCell: "TextGroupCell",

  },
  {
    accessorKey: 'email',
    header: 'Email',
    id: 'email',
    filterType: 'text',
    cell: "TextCell",

  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    id: 'phone',
    filterType: 'number',
    cell: "TextCell",

  },
  {
    accessorKey: 'isActive',
    header: 'Kích Hoạt',
    id: 'isActive',
    accessorFn: `row => row.isActive === undefined ? "": row.isActive === 0 ?"Không kích hoạt": "Đã kích hoạt"`,
    filterType: 'text',
    // cell: (cell)=>{
    //     console.log("cell.getValue()",cell.getValue())
    //     return cell.getValue() === "0" ? "Đã Đạt": "không đạt"
    // },
    cell: 'TextCell',

    enableGlobalFilter: false
  },
  {
    accessorKey: 'createdAt',
    accessorFn: 'row => formatDateTime(row.createdAt)',
    header: 'Ngày tạo',
    id: 'createdAt',
    filterType: 'dateTime',
    cell: '(info) => info.getValue()',
    enableGlobalFilter: false
  },
  {
    accessorKey: 'createdBy',
    header: 'Người tạo',
    id: 'createdBy',
    filterType: 'text',
    cell: 'TextCell',
    enableGlobalFilter: false
  },

]



