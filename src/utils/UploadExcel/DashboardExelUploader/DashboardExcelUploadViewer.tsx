// import React, { useState } from 'react';
import {
  ReactTableBasic,
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

import LoadingOverlay from '../../LoadingOverlay/LoadingOverlay';
import type { ExcelRow, ColumnMap } from '../readExcel'
import firstColumn from './firstColumn';

type ColumnConfig = {
  id: string;
  header: string;
  cell?: any;
  [key: string]: any; // Cho phép thêm các thuộc tính bất kỳ
};



type ColumnValidationConfig = {
  columnNames: Record<string, string>; // { excelField: dbField }
  urlCheck: string;
  excludeField?: string; // tên field trong db để loại trừ khi so sánh
};

interface Props {
  columns: ColumnConfig[];
  sheetName?: string;
  fileName?: string;
  guideSheet?: string;
  headerRowNumber?: number;
  ruleSchema?: RuleSchema;
  translateMessages?: Partial<TranslateMessageMap>;
  isCheckLocalDuplicates?: boolean;
  columnCheckExistance?: ColumnValidationConfig[];
  columnCheckNotExistance?: ColumnValidationConfig[];
  onCheckUpload?: (e:any) => void;
  onCancel?: (e:any) => void;
  title?: string | null;
  ListIdsConfig?: ListIdsConfig;
}

type ListIdsConfig = {
  url: string;
  fieldGet: string;  // ví dụ: 'id'
  fieldGive: string; // ví dụ: 'oldCode'
  fieldSet: string;
};


const DashboardExcelUploadViewer: React.FC<Props> = ({
  columns = [],
  fileName = 'import_data.xlsx',
  sheetName = 'Sheet1',
  guideSheet = 'Hướng dẫn',
  headerRowNumber = 1,
  ruleSchema = {},
  translateMessages,
  isCheckLocalDuplicates = true,
  columnCheckExistance = [],
  columnCheckNotExistance = [],
  onCheckUpload = ( ) => { },
  onCancel = () => { },
  title = null,
  ListIdsConfig = {},
}) => {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    let enriched = rawData;
    if (isCheckLocalDuplicates) {
      // ✅ Bước 1 kiểm tra xem có bị trùng dữ liệu trong rawData của các columnCheckExistance không. nếu có trả ra lỗi 
      enriched = validateLocalDuplicates(rawData, columnCheckExistance);
      const hasLocalDuplicates = enriched.some(row => row._errors && Object.keys(row._errors).length > 0);
      if (hasLocalDuplicates) {
        enriched = markErrorValues(enriched);
        setData(enriched);
        setIsLoading(false);
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
        setIsLoading(false);
        return; // ⛔ Dừng lại nếu có lỗi
      }
    }

    // ✅ Bước 3: kiểm tra với database
    enriched = await validateWithDatabase(
      rawData,
      ListIdsConfig,
      columnCheckExistance,
      columnCheckNotExistance
    );
    // thêm ERROR: vào trước mỗi ô bị lỗi
    enriched = markErrorValues(enriched);
    // ✅ Cập nhật dữ liệu cuối cùng
    setData(enriched);
    setIsLoading(false);
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
      {isLoading && (
        <LoadingOverlay
          message="Đang xử lý dữ liệu, vui lòng chờ..."
          onDoubleClick={() => setIsLoading(false)}
        ></LoadingOverlay>
      )}
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
          fileName={fileName || 'mau_nhap_du_lieu.xlsx'}
          sheetName={sheetName || 'Sheet1'}
          guideSheet={guideSheet || 'Hướng dẫn'}
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




export const validateWithDatabase = async (
  rows: ExcelRow[],
  listIds: ListIdsConfig,
  columnCheckExistance?: ColumnValidationConfig[],
  columnCheckNotExistance?: ColumnValidationConfig[]
): Promise<ExcelRow[]> => {
  const errorsMap: Record<number, Record<string, string>> = {};

  // 🔍 Bước 1: enrich dữ liệu với fieldGet (ví dụ: id)
  if (listIds?.url && listIds.fieldGive && listIds.fieldGet && listIds.fieldSet) {
    const valuesToSend = rows.map(row => row[listIds.fieldGive]).filter(Boolean);

    try {
      const { data, status } = await postData({
        url: listIds.url,
        data: { data: valuesToSend },
      });

      if (status && Array.isArray(data)) {
        const map = new Map<string, any>();
        data.forEach((item: any) => {
          const key = item[listIds.fieldSet]; // ví dụ: code
          const value = item[listIds.fieldGet]; // ví dụ: id
          if (key) map.set(key, value);
        });

        rows.forEach(row => {
          const key = row[listIds.fieldGive]; // ví dụ: oldCode
          const mappedValue = map.get(key);
          if (mappedValue) {
            row[listIds.fieldGet] = mappedValue; // gán id vào dòng
          }
        });
      }
    } catch (err) {
      console.error('Lỗi enrich dữ liệu:', err);
    }
  }

  // 🔧 Hàm build payload gửi lên API
  const buildPayload = (
    mapping: Record<string, string>,
    excludeField?: string
  ): {
    fields: Array<Record<string, any>>;
    excludeField?: string;
  } => {
    const fields = rows.map(row => {
      const field: Record<string, any> = {};

      Object.entries(mapping).forEach(([excelKey, dbKey]) => {
        field[dbKey] = row[excelKey];
      });

      if (excludeField && row[excludeField]) {
        field[excludeField] = row[excludeField];
      }

      return field;
    });

    return excludeField ? { fields, excludeField } : { fields };
  };

  // 🔍 Hàm xử lý kiểm tra tồn tại / không tồn tại
  const handleValidation = async (
    configs: ColumnValidationConfig[],
    shouldExist: boolean
  ) => {
    for (const config of configs) {
      const { columnNames, urlCheck, excludeField } = config;
      const payload = buildPayload(columnNames, excludeField);
      try {
        const { data, status, errorCode } = await postData({ url: urlCheck, data: payload });

        if (status && data) {
          Object.entries(data).forEach(([indexStr, result]) => {
            const index = Number(indexStr);
            const row = rows[index];

            Object.entries(columnNames).forEach(([excelKey, dbKey]) => {
              const isValid = result?.[dbKey];

              const shouldExclude =
                excludeField &&
                dbKey === excludeField &&
                row[excludeField] === result?.[dbKey];

              if (shouldExclude) return;

              const isError = shouldExist ? isValid : !isValid;
              if (isError) {
                if (!errorsMap[index]) errorsMap[index] = {};
                errorsMap[index][excelKey] = `Giá trị "${row[excelKey]}" ${shouldExist ? 'đã tồn tại' : 'không tồn tại'}`;
              }
            });
          });
        }

        // Xử lý lỗi chi tiết từ failData nếu có
        if (errorCode?.failData && Array.isArray(errorCode.failData)) {
          errorCode.failData.forEach((failItem: any, idx: number) => {
            const fieldErrors = failItem?.errors;
            if (fieldErrors && typeof fieldErrors === 'object') {
              Object.entries(fieldErrors).forEach(([dbKey, message]) => {
                const excelKey = Object.entries(columnNames).find(([, v]) => v === dbKey)?.[0];
                if (excelKey) {
                  if (!errorsMap[idx]) errorsMap[idx] = {};
                  errorsMap[idx][excelKey] = String(message);
                }
              });
            }
          });
        }
      } catch (err) {
        rows.forEach((_, index) => {
          Object.keys(columnNames).forEach((excelKey) => {
            if (!errorsMap[index]) errorsMap[index] = {};
            errorsMap[index][excelKey] = `Lỗi kiểm tra ${shouldExist ? 'tồn tại' : 'không tồn tại'}: ${err}`;
          });
        });
      }
    }
  };

  // 🔍 Bước 2: kiểm tra tồn tại
  if (columnCheckExistance) {
    await handleValidation(columnCheckExistance, true);
  }

  // 🔍 Bước 3: kiểm tra không tồn tại
  if (columnCheckNotExistance) {
    await handleValidation(columnCheckNotExistance, false);
  }

  // ✅ Bước 4: gắn lỗi và trạng thái hợp lệ
  return rows.map((row, index) => ({
    ...row,
    _errors: errorsMap[index] || {},
    _valid: !errorsMap[index] || Object.keys(errorsMap[index]).length === 0,
  }));
};





const decorateColumnsWithError = (cols: ColumnConfig[]): ColumnConfig[] =>
  cols.map((col) => {
    return {
      ...col,
      cell: (info: any) => {
        const row = info.row.original;
        const error = row._errors?.[col.id];

        // Nếu không có lỗi → dùng cell gốc nếu có
        if (!error) {
          return typeof col.cell === 'function'
            ? col.cell(info)
            : info.getValue(); // fallback nếu không có cell gốc
        }

        // Nếu có lỗi → render với style đỏ và tooltip
        const value = info.getValue();
        return (
          <div style={{ color: 'red' }} title={error}>
            ❌ {value}
          </div>
        );
      },
    };
  });




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
  columnCheckExistance: ColumnValidationConfig[]
): ExcelRow[] {
  const errorsMap: Record<number, Record<string, string>> = {};

  // 🔍 Gom tất cả các key Excel từ columnNames
  const columns = Array.from(
    new Set(
      columnCheckExistance.flatMap(cfg => Object.keys(cfg.columnNames))
    )
  );

  columns.forEach(col => {
    const seen = new Map<string, number[]>(); // value → list of row indices

    rows.forEach((row, index) => {
      let rawValue = row[col];

      if (rawValue === null || rawValue === undefined || String(rawValue).trim() === '') return;

      rawValue = String(rawValue).replace(/^ERROR:\s*/, '').trim();

      if (!seen.has(rawValue)) {
        seen.set(rawValue, []);
      }
      seen.get(rawValue)!.push(index);
    });

    // ✅ Ghi lỗi cho các giá trị bị trùng
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

  // ✅ Gắn lỗi vào từng dòng
  return rows.map((row, index) => ({
    ...row,
    _errors: {
      ...(row._errors || {}),
      ...(errorsMap[index] || {}),
    },
    _valid: !errorsMap[index] || Object.keys(errorsMap[index]).length === 0,
  }));
}
