import React, { useState } from "react";
import { DashboardExcelUploadViewer } from "../../../../utils/UploadExcel";
import { messagesEn, messagesVi } from "../../../../utils/validation";
import { postData } from "../../../../utils/axios";
import LoadingOverlay from "../../../../utils/LoadingOverlay/LoadingOverlay";
import type { RuleSchema } from "../../../../utils/validation";
import { AlertDialog } from "../../../../utils/AlertDialog";
import type { AlertInfo } from "../../../../utils/AlertDialog";
import { resolve } from "mathjs";

interface ColumnConfig {
    id: string;
    header: string;
    cell?: any;
    [key: string]: any; // Cho phép thêm các thuộc tính bất kỳ
};

interface ColumnValidationConfig {
    columnNames: Record<string, string>; // { excelField: dbField }
    urlCheck: string;
    excludeField?: string; // tên field trong db để loại trừ khi so sánh
};


interface DashboardSubjectsExcelInsertSetting {
    columns: ColumnConfig[];
    ruleSchema: RuleSchema;
    columnCheckExistance: ColumnValidationConfig[];
    columnCheckNotExistance: ColumnValidationConfig[];
    sheetName: string;
    fileName: string;
    guideSheet: string;
    title: string;
    resolveDataFunction?: (data: any[]) => any[] | null, // hàm để xử lý dữ liệu trước khi gửi lên server
};

interface DashboardSubjectsExcelInsertViewerProps {
    urlPost: string,
    config: DashboardSubjectsExcelInsertSetting,
    onCancel: (e: any) => void,
    onDone: (e: any) => void,

}


const DashboardSubjectsExcelInsertViewer = ({ urlPost, config, onCancel, onDone }: DashboardSubjectsExcelInsertViewerProps) => {

    const { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, sheetName, fileName, guideSheet, title, resolveDataFunction } = config;
    const [isLoading, setIsLoading] = useState(false);

    const [alertinfo, setAlertinfo] = useState<AlertInfo>({
        isAlertShow: false,
        alertMessage: '',
        type: 'error',
        title: 'Lỗi',
        showConfirm: true,
        showCancel: true
    });



    const onCheckUpload = async (dataUpload: any[]) => {
        setIsLoading(true);

        const resolveDataUpload = resolveDataFunction ? await resolveDataFunction(dataUpload) : dataUpload;

        const result = await postData({ url: urlPost, data: resolveDataUpload });
        const { data, errorCode, status } = result
        if (status) {
            setIsLoading(false);
            onDone(true);
        } else {
            const errorMessages = Object.entries(errorCode?.failData || {}).map(([key, value]) => `${value}`).join(', ');
            setAlertinfo({
                isAlertShow: true,
                alertMessage: `Có lỗi xảy ra khi upload dữ liệu: ${errorMessages}`,
                type: "error",
                title: "Lỗi",
                showCancel: true,
                showConfirm: false,
                onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            });

            setIsLoading(false);
        }
    }


    return (
        <>
            {isLoading && <LoadingOverlay message="Đang upload dữ liệu..." onDoubleClick={() => setIsLoading(false)} />}
            <AlertDialog
                type={alertinfo.type || "error"}
                title={alertinfo.title || "Lỗi"}
                message={alertinfo.alertMessage || ""}
                show={alertinfo.isAlertShow || false}
                onClose={alertinfo.onClose ?? (() => { })}
                onConfirm={alertinfo.onConfirm ?? (() => { })}
                onCancel={alertinfo.onCancel ?? (() => { })}
                showConfirm={alertinfo.showConfirm ?? true}
                showCancel={alertinfo.showCancel ?? true}
            />

            <DashboardExcelUploadViewer
                columns={columns}
                sheetName={sheetName}
                fileName={fileName}
                guideSheet={guideSheet}
                title={title}
                ruleSchema={ruleSchema}
                translateMessages={messagesVi}
                headerRowNumber={1}
                isCheckLocalDuplicates={true}
                columnCheckExistance={columnCheckExistance}
                columnCheckNotExistance={columnCheckNotExistance}
                onCheckUpload={onCheckUpload}
                onCancel={onCancel}
            ></DashboardExcelUploadViewer>
        </>

    )
}

export default DashboardSubjectsExcelInsertViewer;