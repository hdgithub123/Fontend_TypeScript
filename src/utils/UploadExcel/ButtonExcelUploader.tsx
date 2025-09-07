import React from 'react';
import readExcel from './readExcel';

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
  sheetName = 'Sheet1',
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
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        {...inputProps} // truyền các prop như className, style, id, etc.
      />
    </div>
  );
};

export default ButtonExcelUploader;
