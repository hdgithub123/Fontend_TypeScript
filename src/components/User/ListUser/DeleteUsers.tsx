// viết 1 component xóa users với tham số đầu vào là url xóa và mảng selectUsers
import { deleteData } from "../../../utils/axios";
import { AlertDialog, type AlertInfo } from '../../../utils/AlertDialog';
import { useState } from "react";
interface DeleteUsersProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  deleteUrl: string;
  selectUsers: any[];
  setSelectUsers: (users: any[]) => void;
  setData: (data: any) => void;
  children?: React.ReactNode;
}
const DeleteUsers = ({ deleteUrl, selectUsers, setSelectUsers, setData, children, ...buttonProps }: DeleteUsersProps) => {

    const [alertinfo, setAlertinfo] = useState<AlertInfo>({
        isAlertShow: false,
        alertMessage: '',
        type: 'error',
        title: 'Lỗi',
        showConfirm: true,
        showCancel: true
    });

    const handleDeleteUsers = async () => {

        // nếu selectUsers rỗng thì thông báo lỗi
        if (!Array.isArray(selectUsers) || selectUsers.length === 0) {
            setAlertinfo({
                isAlertShow: true,
                alertMessage: 'Không có người dùng nào được chọn để xóa.',
                type: 'error',
                title: 'Lỗi',
                showConfirm: false,
                showCancel: true,
                onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
                onCancel: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            });
            return;
        }

        // lọc {id:} từ selectUsers gán vào deleteUsers
        const deleteUsers = selectUsers
            .filter((user: any) => user && user.id)
            .map((user: any) => ({ id: user.id }));

        // tạo thông báo xác nhận xóa
        setAlertinfo({
            isAlertShow: true,
            alertMessage: 'Bạn có chắc chắn muốn xóa những người dùng đã chọn?',
            type: 'warning',
            title: 'Xác nhận',
            showConfirm: true,
            showCancel: true,
            onClose: () => setAlertinfo(prev => ({ ...prev, isAlertShow: false })),
            onConfirm: async () => {
                const result = await deleteData({ url: deleteUrl, data: deleteUsers });
                if (result?.status) {
                    // xóa đi selectUsers khỏi data gán lại vào setData
                    if (Array.isArray(selectUsers) && selectUsers.length > 0) {
                        const deleteIds = selectUsers.map((user: any) => user.id);
                        setData(prev =>
                            prev.filter((user: any) => !deleteIds.includes(user.id))
                        );
                        setSelectUsers([]);
                    }
                    setAlertinfo(prev => ({ ...prev, isAlertShow: false }))
                } else {
                    setAlertinfo({
                        isAlertShow: true,
                        alertMessage: result?.errorCode?.failData?.code === "Not allow delete admin" ? "Không được xóa tên đăng nhập admin" : result?.errorCode?.failData?.isSystem === "Cannot delete system records" ? "Không được xóa thông tin hệ thống" : "Xóa người dùng thất bại",
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
            <button disabled={selectUsers.length === 0} onClick={handleDeleteUsers} {...buttonProps} >{children?children:"Delete"}</button>
        </div>
    );
}

export default DeleteUsers;
