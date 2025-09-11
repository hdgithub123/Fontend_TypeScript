// import * as XLSX from 'xlsx-js-style';

// export type ColumnMap = Record<string, string>;

// export interface ExcelRow {
//   [key: string]: string | number | boolean | null;
// }

// interface ReadExcelOptions {
//   file: File;
//   columnMap: ColumnMap;
//   sheetName?: string;
//   headerRowNumber?: number; // dòng tiêu đề như trong Excel (1-based)
// }

// const readExcel = ({
//   file,
//   columnMap,
//   sheetName,
//   headerRowNumber = 1,
// }: ReadExcelOptions): Promise<ExcelRow[]> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (evt: ProgressEvent<FileReader>) => {
//       try {
//         const data = new Uint8Array(evt.target?.result as ArrayBuffer);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const targetSheet = sheetName || workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[targetSheet];
//         if (!worksheet) throw new Error(`Không tìm thấy sheet: ${targetSheet}`);

//         const headerRowIndex = Math.max(headerRowNumber - 1, 0);

//         const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
//           defval: '',
//           range: headerRowIndex,
//         });

//         const result: ExcelRow[] = rawData.map((row) => {
//           const mappedRow: ExcelRow = {};
//           for (const [key, columnName] of Object.entries(columnMap)) {
//             mappedRow[key] = row[columnName] ?? '';
//           }
//           return mappedRow;
//         });

//         resolve(result);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = () => reject(reader.error);
//     reader.readAsArrayBuffer(file);
//   });
// };

// export default readExcel;


import * as XLSX from 'xlsx-js-style';

export type ColumnMap = Record<string, string>;

export interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

interface ReadExcelOptions {
  file: File;
  columnMap: ColumnMap;
  sheetName?: string;
  headerRowNumber?: number; // dòng tiêu đề (1-based)
}

const readExcel = ({
  file,
  columnMap,
  sheetName,
  headerRowNumber = 1,
}: ReadExcelOptions): Promise<ExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const targetSheet = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[targetSheet];
        if (!worksheet) throw new Error(`Không tìm thấy sheet: ${targetSheet}`);

        const headerRowIndex = Math.max(headerRowNumber - 1, 0);

        // Đọc dữ liệu gốc, lấy header từ file
        const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          range: headerRowIndex,
        });

        // Lấy danh sách cột thực sự có trong file
        const actualHeaders = Object.keys(rawData[0] || {});

        const result: ExcelRow[] = rawData.map((row) => {
          const mappedRow: ExcelRow = {};
          for (const [key, columnName] of Object.entries(columnMap)) {
            if (actualHeaders.includes(columnName)) {
              mappedRow[key] = row[columnName] ?? '';
            }
          }
          return mappedRow;
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export default readExcel;
