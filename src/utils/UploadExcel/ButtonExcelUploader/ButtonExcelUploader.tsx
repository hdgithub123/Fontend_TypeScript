import React from 'react';
import readExcel from '../readExcel';
import styles from './ButtonExcelUploader.module.scss'

export interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

export type ColumnMap = Record<string, string>;

export interface ExcelUploaderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  columnMap: ColumnMap;
  sheetName?: string;
  headerRowNumber?: number;
  onUploaded?: (data: ExcelRow[]) => void;
}

const ButtonExcelUploader: React.FC<ExcelUploaderProps> = ({
  columnMap,
  sheetName = 'Import Sheet',
  headerRowNumber = 1,
  onUploaded,
  ...inputProps // nhận tất cả các prop còn lại như className, style, id, etc.
}) => {

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await readExcel({
          file,
          columnMap,
          sheetName,
          headerRowNumber,
        });
        onUploaded?.(result);
      } catch (error) {
        onUploaded?.([]);
      }
      // ✅ Reset input value để cho phép chọn lại cùng file
      e.target.value = '';
    }
  };
  return (
    <input
      {...inputProps} // truyền các prop như className, style, id, etc.
      type="file"
      accept=".xlsx,.xls,.xlsm"
      onChange={handleFileUpload}
    />
  );
};

export default ButtonExcelUploader;