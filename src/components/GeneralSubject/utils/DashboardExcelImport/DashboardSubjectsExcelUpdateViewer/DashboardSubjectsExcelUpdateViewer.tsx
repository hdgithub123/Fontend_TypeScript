import { useState } from "react";
import { DashboardExcelUploadViewer } from "../../../../../utils/UploadExcel";
//import { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig } from "./setting";
import { messagesEn, messagesVi } from "../../../../../utils/validation";
import { postData, putData } from "../../../../../utils/axios";
import LoadingOverlay from "../../../../../utils/LoadingOverlay/LoadingOverlay";
import type { RuleSchema } from "../../../../../utils/validation";
import { AlertDialog } from "../../../../../utils/AlertDialog";
import type { AlertInfo } from "../../../../../utils/AlertDialog";
import { e } from "mathjs";


interface ColumnConfig {
    id: string;
    header: string;
    cell?: any;
    [key: string]: any; // Cho phép thêm các thuộc tính bất kỳ
};


interface ListIdsConfig {
    url: string,
    fieldGet: string,
    fieldGive: string,
    fieldSet: string,
}

interface ColumnValidationConfig {
    columnNames: Record<string, string>; // { excelField: dbField }
    urlCheck: string;
    excludeField?: string; // tên field trong db để loại trừ khi so sánh
};


interface DashboardSubjectsExcelUpdateSetting {
    columns: ColumnConfig[];
    ruleSchema: RuleSchema;
    columnCheckExistance: ColumnValidationConfig[];
    columnCheckNotExistance: ColumnValidationConfig[];
    ListIdsConfig: ListIdsConfig;
    sheetName: string;
    fileName: string;
    guideSheet: string;
    title: string;
    resolveDataFunction?: (data: any[]) => any[] | null, // hàm để xử lý dữ liệu trước khi gửi lên server
};


interface DashboardSubjectsExcelUpdateViewerProps {
    urlPut: string,
    config: DashboardSubjectsExcelUpdateSetting,
    onCancel: (e: any) => void,
    onDone: (e: any) => void,
    // resolveDataFunction?: (data: any[]) => any[] | null, // hàm để xử lý dữ liệu trước khi gửi lên server
}


const DashboardSubjectsExcelUpdateViewer = ({ urlPut, config, onCancel, onDone }: DashboardSubjectsExcelUpdateViewerProps) => {
    const { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance, ListIdsConfig, sheetName, fileName, guideSheet, title, resolveDataFunction } = config;
    const urlidscodes = ListIdsConfig?.url || ""
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
        const oldCodes = dataUpload.map(item => item.oldCode);
        // Gửi danh sách oldCode lên server để kiểm tra
        const { data, errorCode, status } = await postData({ url: urlidscodes, data: { data: oldCodes } });

        if (status) {
            // tạo ra danh sách mới bằng cách gán id vào dataUpload và loại bỏ key oldCode ra khỏi dataUpload
            const newDataUpload = dataUpload.map(item => {
                const found = data.find(d => d.code === item.oldCode);
                if (found) {
                    const { oldCode, ...rest } = item;
                    return { ...rest, id: found.id };
                }
                return item; // nếu không tìm thấy thì giữ nguyên
            });


            let resolveDataUpload = resolveDataFunction ? await resolveDataFunction(newDataUpload) : newDataUpload;
            //thực hiên update users
            const { data: dataUpdate, errorCode: errorCodeUpdate, status: statusUpdate } = await putData({ url: urlPut, data: resolveDataUpload });

            if (statusUpdate) {
                setIsLoading(false);
                onDone(true);
            } else {

                const errorMessages = Object.entries(errorCodeUpdate?.failData || {}).map(([key, value]) => `${value}`).join(', ');
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
                ListIdsConfig={ListIdsConfig}
            ></DashboardExcelUploadViewer>
        </>

    )
}

export default DashboardSubjectsExcelUpdateViewer;