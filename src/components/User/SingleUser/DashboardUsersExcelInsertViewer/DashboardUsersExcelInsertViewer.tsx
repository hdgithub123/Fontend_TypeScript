import {DashboardExcelUploadViewer} from "../../../../utils/UploadExcel";
import { columns, ruleSchema, columnCheckExistance, columnCheckNotExistance } from "./setting";
import { messagesEn,messagesVi } from "../../../../utils/validation";
import { postData } from "../../../../utils/axios";


const DashboardUsersExcelInsertViewer = ({urlPost, onCancel}) => {

    const onCheckUpload = async (dataUpload) => {
        const {data, errorCode, status} = await postData({ url: urlPost, data: dataUpload });
        if (status) {
            onCancel(true);
        }
        
    }


    return (
        <DashboardExcelUploadViewer
            columns={columns}
            sheetName='Import Users'
            fileName="users_import_template.xlsx"
            guideSheet='Hướng dẫn'
            title='Import Users'
            ruleSchema={ruleSchema}
            translateMessages={messagesVi}
            headerRowNumber={1}
            isCheckLocalDuplicates={true}
            columnCheckExistance={columnCheckExistance}
            columnCheckNotExistance={columnCheckNotExistance}
            onCheckUpload={onCheckUpload}
            onCancel={onCancel}
        ></DashboardExcelUploadViewer>
    )
}

export default DashboardUsersExcelInsertViewer;