// import React, { useState } from 'react';
import {
  ReactTableBasic,
  ReactTableBasicArrowkey,
  ReactTableFull,
  ReactTableFullArrowkey,
  ReactTableNomalArrowkey,
  ReactTablePages,
  SearchDropDown,
  formatNumber,
  SumFooter,
  AverageFooter,
  CountFooter,

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
} from 'react-table'







import React, { useState } from 'react';
// import {
//   ReactTableNomalArrowkey,
// } from 'react-table';

import ButtonExcelUploader from '../ButtonExcelUploader';
import ButtonExcelTemplateDownloader from '../ButtonExcelTemplateDownloader'
import { postData } from '../../../utils/axios';
import { validateDataArray } from '../../validation';
import type {
  RuleSchema,
  TranslateMessageMap,
  ValidationResult,
} from '../../validation';


import type { ExcelRow, ColumnMap } from '../readExcel'

type ColumnConfig = {
  id: string;
  header: string;
  cell?: any;
};

type ColumnValidationConfig = {
  columnNames: string[];
  urlCheck: string;
};

interface Props {
  columns: ColumnConfig[];
  sheetName?: string;
  headerRowNumber?: number;
  ruleSchema?: RuleSchema;
  translateMessages?: Partial<TranslateMessageMap>;
  isCheckLocalDuplicates?: boolean;
  columnCheckExistance?: ColumnValidationConfig[];
  columnCheckNotExistance?: ColumnValidationConfig[];
}

const DashboardExcelUploadViewer: React.FC<Props> = ({
  columns = [],
  sheetName = 'Sheet1',
  headerRowNumber = 1,
  ruleSchema,
  translateMessages,
  isCheckLocalDuplicates = true,
  columnCheckExistance = [],
  columnCheckNotExistance = [],
}) => {
  const [data, setData] = useState<ExcelRow[]>([]);

  const columnMap: ColumnMap = columns.reduce((map, col) => {
    map[col.id] = col.header;
    return map;
  }, {} as ColumnMap);


  // biến đổi ruleSchema thành columnMapSchema bằng cách thay các key ruleSchema thành các key columnMap

  let columnMapSchema: RuleSchema | undefined = undefined;
if (ruleSchema && columnMap) {
  columnMapSchema = Object.keys(ruleSchema).reduce((acc, key) => {
    // Nếu key có trong columnMap thì dùng key mới, ngược lại giữ nguyên key cũ
    const newKey = columnMap[key] ? columnMap[key] : key;
    acc[newKey] = ruleSchema[key];
    return acc;
  }, {} as RuleSchema);
}



  const handleUpload = async (rawData: ExcelRow[]) => {
    let enriched = rawData;

    if (isCheckLocalDuplicates) {
      // ✅ Bước 1 kiểm tra xem có bị trùng dữ liệu trong rawData của các columnCheckExistance không. nếu có trả ra lỗi 
      enriched = validateLocalDuplicates(rawData, columnCheckExistance);
      const hasLocalDuplicates = enriched.some(row => row._errors && Object.keys(row._errors).length > 0);
      if (hasLocalDuplicates) {
        enriched = markErrorValues(enriched);
        setData(enriched);
        return;
      }
    }


    // ✅ Bước 2: validate theo schema
    if (ruleSchema) {
      const { results } = validateDataArray(rawData, ruleSchema, translateMessages);
      enriched = enrichDataWithErrors(rawData, results);
      const hasErrors = enriched.some(row => row._errors && Object.keys(row._errors).length > 0);
      if (hasErrors) {
        setData(enriched);
        return; // ⛔ Dừng lại nếu có lỗi
      }
    }




    // ✅ Bước 3: kiểm tra với database
    enriched = await validateWithDatabase(
      rawData,
      columnCheckExistance,
      columnCheckNotExistance
    );
    // thêm ERROR: vào trước mỗi ô bị lỗi
    enriched = markErrorValues(enriched);
    // ✅ Cập nhật dữ liệu cuối cùng
    setData(enriched);
  };





  return (
    <div>
      <h2>📥 Upload file Excel</h2>
      <ButtonExcelUploader
        columnMap={columnMap}
        sheetName={sheetName}
        headerRowNumber={headerRowNumber}
        onUploaded={handleUpload}
        style={{ marginBottom: '1rem' }}
      />
      <ButtonExcelTemplateDownloader
      ruleSchema={columnMapSchema}
      
      ></ButtonExcelTemplateDownloader>
      
      <ReactTableBasic
        data={data}
        columns={decorateColumnsWithError(columns)}
        isGlobalFilter={true}
      />
    </div>
  );
};

export default DashboardExcelUploadViewer;




const validateWithDatabase = async (
  rows: ExcelRow[],
  columnCheckExistance?: ColumnValidationConfig[],
  columnCheckNotExistance?: ColumnValidationConfig[]
): Promise<ExcelRow[]> => {
  const enrichedRows = [...rows];
  const errorsMap: Record<number, Record<string, string>> = {};

  const buildFields = (cols: string[]): Array<Record<string, any>> =>
    rows.map((row) => {
      const field: Record<string, any> = {};
      cols.forEach((col) => {
        field[col] = row[col];
      });
      return field;
    });

  const handleValidation = async (
    configs: ColumnValidationConfig[],
    shouldExist: boolean
  ) => {
    for (const config of configs) {
      const { columnNames, urlCheck } = config;
      const payload = { fields: buildFields(columnNames) };

      try {
        const { data, status, errorCode } = await postData({ url: urlCheck, data: payload });

        console.log("data", data);
        console.log("errorCode", errorCode);

        // ✅ Nếu status OK → xử lý theo data
        if (status && data) {
          Object.entries(data).forEach(([indexStr, result]) => {
            const index = Number(indexStr);
            columnNames.forEach((col) => {
              const isValid = result?.[col];
              const isError = shouldExist ? isValid : !isValid;
              if (isError) {
                if (!errorsMap[index]) errorsMap[index] = {};
                errorsMap[index][col] = `Giá trị "${rows[index][col]}" ${shouldExist ? "đã tồn tại" : "không tồn tại"}`;
              }
            });
          });
        }

        // ✅ Nếu có failData → xử lý từng lỗi cụ thể
        if (errorCode?.failData && Array.isArray(errorCode.failData)) {
          errorCode.failData.forEach((failItem: any, idx: number) => {
            const fieldErrors = failItem?.errors;
            if (fieldErrors && typeof fieldErrors === 'object') {
              Object.entries(fieldErrors).forEach(([col, message]) => {
                if (!errorsMap[idx]) errorsMap[idx] = {};
                errorsMap[idx][col] = String(message);
              });
            }
          });
        }
      } catch (err) {
        rows.forEach((_, index) => {
          columnNames.forEach((col) => {
            if (!errorsMap[index]) errorsMap[index] = {};
            errorsMap[index][col] = `Lỗi kiểm tra ${shouldExist ? "tồn tại" : "không tồn tại"}: ${err}`;
          });
        });
      }
    }
  };

  if (columnCheckExistance) {
    await handleValidation(columnCheckExistance, true);
  }

  if (columnCheckNotExistance) {
    await handleValidation(columnCheckNotExistance, false);
  }

  return enrichedRows.map((row, index) => ({
    ...row,
    _errors: errorsMap[index] || {},
    _valid: !errorsMap[index] || Object.keys(errorsMap[index]).length === 0,
  }));
};




const decorateColumnsWithError = (cols: ColumnConfig[]): ColumnConfig[] =>
  cols.map((col) => ({
    ...col,
    cell: (info: any) => {
      const value = info.getValue();
      const row = info.row.original;
      const error = row._errors?.[col.id];
      return (
        <div style={{ color: error ? 'red' : 'inherit' }} title={error || ''}>
          {error ? `❌ ${value}` : value}
        </div>
      );
    },
  }));



function enrichDataWithErrors(rawData: ExcelRow[], results: ValidationResult[]): ExcelRow[] {
  return rawData.map((row, i) => {
    const errors = results[i]?.errors || {};
    const valid = results[i]?.valid ?? true;

    const newRow: Record<string, any> = {};

    for (const key in row) {
      if (key === '_errors' || key === '_valid') continue;

      const value = row[key];
      newRow[key] = errors[key] ? `ERROR: ${value}` : value;
    }

    return {
      ...newRow,
      _errors: errors,
      _valid: valid,
    };
  });
}


function markErrorValues(rows: ExcelRow[]): ExcelRow[] {
  return rows.map((row) => {
    const errors = row._errors || {};
    const valid = row._valid ?? true;

    const newRow: Record<string, any> = {};

    for (const key in row) {
      if (key === '_errors' || key === '_valid') continue;

      const value = row[key];
      newRow[key] = errors[key] ? `ERROR: ${value}` : value;
    }

    return {
      ...newRow,
      _errors: errors,
      _valid: valid,
    };
  });
}


function validateLocalDuplicates(
  rows: ExcelRow[],
  columnCheckExistance: { columnNames: string[] }[]
): ExcelRow[] {
  const enrichedRows = [...rows];
  const errorsMap: Record<number, Record<string, string>> = {};

  // 🔍 Gom tất cả columnNames lại thành một mảng duy nhất
  const columns = Array.from(
    new Set(columnCheckExistance.flatMap(cfg => cfg.columnNames))
  );

  columns.forEach(col => {
    const seen = new Map<string, number[]>(); // value → list of row indices

    rows.forEach((row, index) => {
      const rawValue = String(row[col] ?? '').replace(/^ERROR:\s*/, '').trim();
      if (!rawValue) return; // bỏ qua giá trị rỗng

      if (!seen.has(rawValue)) {
        seen.set(rawValue, []);
      }
      seen.get(rawValue)!.push(index);
    });

    // Kiểm tra các giá trị bị trùng
    for (const [value, indices] of seen.entries()) {
      if (indices.length > 1) {
        const lineNumbers = indices.map(i => i + 1).join(', ');
        indices.forEach(i => {
          if (!errorsMap[i]) errorsMap[i] = {};
          errorsMap[i][col] = `Giá trị '${value}' bị trùng ở các dòng số ${lineNumbers}`;
        });
      }
    }
  });

  return enrichedRows.map((row, index) => ({
    ...row,
    _errors: errorsMap[index] || {},
    _valid: !errorsMap[index] || Object.keys(errorsMap[index]).length === 0,
  }));
}