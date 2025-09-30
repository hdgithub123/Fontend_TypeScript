// viết 1 component xóa users với tham số đầu vào là url xóa và mảng selectOrganizations
import { deleteData } from "../../../utils/axios";
import { AlertDialog, type AlertInfo } from '../../../utils/AlertDialog';
import { useState } from "react";
interface DeleteSubjectsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  deleteUrl: string;
  selectSubjects: any[];
  setSelectSubjects: (users: any[]) => void;
  setData: (data: any) => void;
  children?: React.ReactNode;
}
const DeleteSubjects = ({ deleteUrl, selectSubjects, setSelectSubjects, setData, children, ...buttonProps }: DeleteSubjectsProps) => {

    const [alertinfo, setAlertinfo] = useState<AlertInfo>({
        isAlertShow: false,
        alertMessage: '',
        type: 'error',
        title: 'Lỗi',
        showConfirm: true,
        showCancel: true
    });

    const handleDeleteOrganizations = async () => {

        // nếu selectSubjects rỗng thì thông báo lỗi
        if (!Array.isArray(selectSubjects) || selectSubjects.length === 0) {
            setAlertinfo({
                isAlertShow: true,
                alertMessage: 'Không có dữ liệu nào được chọn để xóa.',
                type: 'error',
                title: 'Lỗi',
                showConfirm: false,
                showCancel: true,
                onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            });
            return;
        }

        // lọc {id:} từ selectSubjects gán vào deleteOrganizations
        const deleteOrganizations = selectSubjects
            .filter((user: any) => user && user.id)
            .map((user: any) => ({ id: user.id }));

        // tạo thông báo xác nhận xóa
        setAlertinfo({
            isAlertShow: true,
            alertMessage: 'Bạn có chắc chắn muốn xóa những dữ liệu đã chọn?',
            type: 'warning',
            title: 'Xác nhận',
            showConfirm: true,
            showCancel: true,
            onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            onConfirm: async () => {
                const result = await deleteData({ url: deleteUrl, data: deleteOrganizations });
                if (result?.status) {
                    // xóa đi selectSubjects khỏi data gán lại vào setData
                    if (Array.isArray(selectSubjects) && selectSubjects.length > 0) {
                        const deleteIds = selectSubjects.map((user: any) => user.id);
                        setData(prev =>
                            prev.filter((user: any) => !deleteIds.includes(user.id))
                        );
                        setSelectSubjects([]);
                    }
                    setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
                } else {
                    const errorMessages = Object.entries(result?.errorCode?.failData || {}).map(([key, value]) => `${value}`).join(', ');
                    setAlertinfo({
                        isAlertShow: true,
                        alertMessage: result?.errorCode?.failData?.isSystem === "Cannot delete system records" ? "Không được xóa thông tin hệ thống" : `Xóa dữ liệu thất bại: ${errorMessages} ${result?.errorCode?.sqlMessage || ''} ${result?.errorCode?.message || ''}`,
                        type: "error",
                        title: "Lỗi",
                        showConfirm: true,
                        showCancel: false,
                        onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                        onConfirm: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                    });
                }

            },
            onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
        });
    }

    return (
        <div>
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
            <button disabled={selectSubjects.length === 0} onClick={handleDeleteOrganizations} {...buttonProps} >{children?children:"Delete"}</button>
        </div>
    );
}

export default DeleteSubjects;
