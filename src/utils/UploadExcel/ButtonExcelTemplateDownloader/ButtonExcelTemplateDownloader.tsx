import React, { Children } from 'react';
import * as XLSX from 'xlsx-js-style';
import { autoGenMessageRulesMultiLang } from '../../validation/autoGenMessageRulesMultiLang';
import { messagesVi, messagesEn } from '../../validation';
import type { RuleSchema, TranslateMessageMap } from '../../validation';

// interface Props {
//   ruleSchema: RuleSchema;
//   fileName?: string;
//   sheetName?: string;
//   buttonLabel?: string;
//   guideSheet?: string;
//   messagesMap?: TranslateMessageMap;
// }

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ruleSchema: RuleSchema;
  fileName?: string;
  sheetName?: string;
  guideSheet?: string;
  messagesMap?: TranslateMessageMap;
  children?: React.ReactNode; // 👈 thêm dòng này
}

const ButtonExcelTemplateDownloader: React.FC<Props> = ({
  ruleSchema,
  fileName = 'mau_nhap_du_lieu.xlsx',
  sheetName = 'Import Sheet',
  guideSheet = 'Hướng dẫn',
  messagesMap = messagesVi,
  children,
  ...inputProps
}) => {
  const handleDownload = () => {
    const headers = Object.keys(ruleSchema);
    const worksheetData = [headers];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    headers.forEach((col, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        fill: {
          fgColor: { rgb: ruleSchema[col].required ? 'FFFFCC' : 'FFFFFF' },
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    });
    worksheet['!cols'] = headers.map(() => ({ wch: 20 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);


    const sheet = createGuideSheet(ruleSchema, messagesMap);
    XLSX.utils.book_append_sheet(workbook, sheet, guideSheet);



    XLSX.writeFile(workbook, fileName);

  };

  return <button {...inputProps} onClick={handleDownload}>{children}</button>;
};

export default ButtonExcelTemplateDownloader;



export function createGuideSheet(
  ruleSchema: RuleSchema,
  messagesMap: Partial<TranslateMessageMap>
): XLSX.WorkSheet {
  const headers = Object.keys(ruleSchema);
  const messageRules = autoGenMessageRulesMultiLang(ruleSchema, messagesMap);

  // Tạo dữ liệu cho sheet hướng dẫn
  const guideSheetData = [
    ['HƯỚNG DẪN NHẬP LIỆU', ''],
    ['', ''],
    ['Cột', 'Hướng dẫn nhập dữ liệu'],
    ...headers.map(col => {
      const ruleMessages = messageRules[col];
      const commentText = Object.values(ruleMessages || {})
        .filter(msg => msg !== '') // Lọc bỏ các message rỗng
        .map(msg => `• ${msg}`)
        .join('\n');
      return [col, commentText];
    }),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(guideSheetData);

  // Thiết lập độ rộng cột
  sheet['!cols'] = [
    { wch: 25 }, // Cột "Cột"
    { wch: 60 }, // Cột "Hướng dẫn"
  ];

  // Merge cells cho tiêu đề
  sheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Merge dòng tiêu đề
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }  // Merge dòng trống
  ];

  // Style cho tiêu đề chính
  ['A1'].forEach(cell => {
    if (!sheet[cell]) sheet[cell] = { t: 's', v: guideSheetData[0][0] };
    sheet[cell].s = {
      font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2E75B6' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  });

  // Style cho header bảng
  ['A3', 'B3'].forEach(cell => {
    if (!sheet[cell]) sheet[cell] = { t: 's', v: guideSheetData[2][cell === 'A3' ? 0 : 1] };
    sheet[cell].s = {
      font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '5B9BD5' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'medium', color: { rgb: '2F75B5' } },
        bottom: { style: 'medium', color: { rgb: '2F75B5' } },
        left: { style: 'medium', color: { rgb: '2F75B5' } },
        right: { style: 'medium', color: { rgb: '2F75B5' } },
      },
    };
  });

  // Style cho các hàng dữ liệu
  headers.forEach((col, index) => {
    const rowIndex = index + 3; // Bắt đầu từ row 3
    // Style cho cột tên trường (cột A)
    const colCell = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
    if (!sheet[colCell]) sheet[colCell] = { t: 's', v: col };
    sheet[colCell].s = {
      font: { bold: true, sz: 11, color: { rgb: '44546A' } },
      fill: {
        fgColor: {
          rgb: ruleSchema[col]?.required
            ? 'FFD966' // màu riêng cho required
            : index % 2 === 0
              ? 'FCE4D6'
              : 'E2EFDA'
        }

      },
      alignment: { vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: 'D9D9D9' } },
        bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
        left: { style: 'thin', color: { rgb: 'D9D9D9' } },
        right: { style: 'thin', color: { rgb: 'D9D9D9' } },
      },
    };

    // Style cho cột hướng dẫn (cột B)
    const descCell = XLSX.utils.encode_cell({ r: rowIndex, c: 1 });
    const ruleMessages = messageRules[col];
    const commentText = Object.values(ruleMessages || {})
      .filter(msg => msg !== '')
      .map(msg => `• ${msg}`)
      .join('\n');

    if (!sheet[descCell]) sheet[descCell] = { t: 's', v: commentText };
    sheet[descCell].s = {
      alignment: {
        wrapText: true,
        vertical: 'top',
        horizontal: 'left'
      },
      font: { name: 'Arial', sz: 10, color: { rgb: '444444' } },
      border: {
        top: { style: 'thin', color: { rgb: 'D9D9D9' } },
        bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
        left: { style: 'thin', color: { rgb: 'D9D9D9' } },
        right: { style: 'thin', color: { rgb: 'D9D9D9' } },
      },
      fill: {
        fgColor: {
          rgb: ruleSchema[col]?.required
            ? 'FFD966' // màu riêng cho required
            : index % 2 === 0
              ? 'FCE4D6'
              : 'E2EFDA'
        }

      },
    };
  });

  return sheet;
}
