import { useState } from "react";
import { DashboardExcelUploadViewer } from "../../../../utils/UploadExcel";
import { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance,ListIdsConfig } from "./setting";
import { messagesEn, messagesVi } from "../../../../utils/validation";
import { postData, putData } from "../../../../utils/axios";


const DashboardUsersExcelUpdateViewer = ({ urlPost, onCancel,onDone }) => {
    const urlidscodes =ListIdsConfig?.url || "http://localhost:3000/auth/user/ids-codes"

    const onCheckUpload = async (dataUpload) => {

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

            //kiểm tra xem oldCodes có code = admin không nếu có thì dừng lại và thông báo lỗi cho người dùng
            const hasAdmin = oldCodes.some(code => code === 'admin');
            if (hasAdmin) {
                alert('Không được update user có mã là admin');
                return;
            }
            //thực hiên update users
            const { data: dataUpdate, errorCode: errorCodeUpdate, status: statusUpdate } = await putData({ url: urlPost, data: newDataUpload });
             
            if (statusUpdate) {
                onDone(true);
            }
        }
    }


    return (
        <DashboardExcelUploadViewer
            columns={columns}
            sheetName='Import Users'
            fileName="users_update_template.xlsx"
            guideSheet='Hướng dẫn'
            title='update Users'
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
    )
}

export default DashboardUsersExcelUpdateViewer;