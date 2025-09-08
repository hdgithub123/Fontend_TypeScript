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







import React, { useEffect, useState } from 'react';
import styles from './DashboardExcelUploadViewer.module.scss'
import uploadIcon from './excel.svg'

import cancelIcon from './cancel.svg'

import ButtonExcelUploader from '../ButtonExcelUploader/ButtonExcelUploader';
import ButtonExcelTemplateDownloader from '../ButtonExcelTemplateDownloader/ButtonExcelTemplateDownloader'
import { postData } from '../../../utils/axios';
import { validateDataArray } from '../../validation';
import type {
  RuleSchema,
  TranslateMessageMap,
  ValidationResult,
} from '../../validation';



import type { ExcelRow, ColumnMap } from '../readExcel'
import firstColumn from './firstColumn';


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
  onCheckUpload?: () => void;
  onCancel?: () => void;
  title?: string | null;
}

const DashboardExcelUploadViewer: React.FC<Props> = ({
  columns = [],
  sheetName = 'Sheet1',
  headerRowNumber = 1,
  ruleSchema = {},
  translateMessages,
  isCheckLocalDuplicates = true,
  columnCheckExistance = [],
  columnCheckNotExistance = [],
  onCheckUpload = (e) => { },
  onCancel = () => { },
  title = null,
}) => {
  const [data, setData] = useState<ExcelRow[]>([]);

  const columnMap: ColumnMap = columns.reduce((map, col) => {
    map[col.id] = col.header;
    return map;
  }, {} as ColumnMap);

  const columnsWidthFirst = [firstColumn, ...columns]

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



  const handleLoadFile = async (rawData: ExcelRow[]) => {
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


  const handleUploaded = () => {
    const allRowsValid = data.length > 0 && data.every(row => {
      return row._errors && Object.keys(row._errors).length === 0;
    });

    if (allRowsValid) {
      // loại bỏ _errors và _valid trên mối phần tử của data gán vào originalData
      const originalData = data.map(({ _errors, _valid, ...rest }) => rest);

      onCheckUpload?.(originalData);
    } else {
      onCheckUpload?.(null);
    }
  }



  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.upload}`}
          onClick={handleUploaded}
          disabled={!(data.length > 0 && data.every(row => row._valid))}
        >
          <img src={uploadIcon} alt="Update" className={`${styles.img} ${data.every(row => row._valid) ? styles.active : styles.unactive}`} />
          <span className={styles.span}>Upload</span>
        </button>


        <label className={styles.loadButton}>
          <img src={uploadIcon} alt="Update" className={`${styles.img} ${styles.active}`} />
          <span className={styles.span}>Load File</span>
          <ButtonExcelUploader
            columnMap={columnMap}
            sheetName={sheetName}
            headerRowNumber={headerRowNumber}
            onUploaded={handleLoadFile}
            style={{ display: 'none' }}
          ></ButtonExcelUploader>
        </label>

        <ButtonExcelTemplateDownloader
          ruleSchema={columnMapSchema || {}}
          fileName={'mau_nhap_du_lieu.xlsx'}
          sheetName={sheetName}
          guideSheet={'Hướng dẫn'}
          className={`${styles.button} ${styles.download}`}
        >
          <img src={uploadIcon} alt="Update" className={`${styles.img} ${styles.active}`} />
          <span className={styles.span}>Download Template</span>
        </ButtonExcelTemplateDownloader>
        <button
          className={`${styles.button} ${styles.cancel}`}
          onClick={() => onCancel(true)}
        >
          <img src={cancelIcon} alt="Update" className={`${styles.img} ${styles.active}`} />
          <span className={styles.span}>Cancel</span>
        </button>

      </div>
      <div className={styles.table}>
        <ReactTableBasic
          data={data}
          columns={decorateColumnsWithError(columnsWidthFirst)}
          isGlobalFilter={true}
        />
      </div>



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