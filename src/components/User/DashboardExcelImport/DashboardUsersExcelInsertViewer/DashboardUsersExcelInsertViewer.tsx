import React, { useState } from "react";
import { DashboardExcelUploadViewer } from "../../../../utils/UploadExcel";
// import { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance } from "./setting";
import userSetting from "./setting";
import { messagesEn, messagesVi } from "../../../../utils/validation";
import { postData } from "../../../../utils/axios";
import LoadingOverlay from "../../../../utils/LoadingOverlay/LoadingOverlay";


const DashboardUsersExcelInsertViewer = ({ urlPost, config = userSetting, onCancel, onDone }) => {

    const [isLoading, setIsLoading] = useState(false);

    const onCheckUpload = async (dataUpload) => {
        setIsLoading(true); 
        const { data, errorCode, status } = await postData({ url: urlPost, data: dataUpload });
        if (status) {
            setIsLoading(false);
            onDone(true);
        } else {
            setIsLoading(false);
        }
    }


    return (
        <>
            {isLoading && <LoadingOverlay message="Đang upload dữ liệu..." onDoubleClick={() => setIsLoading(false)} />}
            <DashboardExcelUploadViewer
                columns={config.columns}
                sheetName='Import Users'
                fileName="users_import_template.xlsx"
                guideSheet='Hướng dẫn'
                title='Import Users'
                ruleSchema={config.ruleSchema}
                translateMessages={messagesVi}
                headerRowNumber={1}
                isCheckLocalDuplicates={true}
                columnCheckExistance={config.columnCheckExistance}
                columnCheckNotExistance={config.columnCheckNotExistance}
                onCheckUpload={onCheckUpload}
                onCancel={onCancel}
            ></DashboardExcelUploadViewer>
        </>

    )
}

export default DashboardUsersExcelInsertViewer;