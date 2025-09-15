import React, { useState } from 'react';
import { AlertDialog, type AlertInfo } from '../../../utils/AlertDialog';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    message?: string;
    data: any[];
    onTrigger: () => void;
    children?: React.ReactNode;
}

const NotifyNotSelectedButton: React.FC<Props> = ({ message = "Vui lòng chọn ít nhất một người dùng trong danh sách.", data, onTrigger, children, ...buttonProps }) => {
    const [alertInfo, setAlertInfo] = useState<AlertInfo>({
        isAlertShow: false,
        alertMessage: '',
        type: 'warning',
        title: 'Thông báo',
        showConfirm: true,
        showCancel: false,
    });

    const handleClick = () => {
        if (!data || data.length === 0) {
            setAlertInfo({
                isAlertShow: true,
                alertMessage: message || '⚠️ Vui lòng chọn ít nhất một dữ liệu trong danh sách.',
                type: 'warning',
                title: 'Thông báo',
                showConfirm: false,
                showCancel: true,
                onCancel: () => setAlertInfo(prev => ({ ...prev, isAlertShow: false })),
                onClose: () => setAlertInfo(prev => ({ ...prev, isAlertShow: false })),
            });
            return;
        }

        onTrigger();
    };

    return (
        <>
            <button disabled={data.length === 0} onClick={handleClick} {...buttonProps}>
                {children ?? 'button'}
            </button>
            <AlertDialog
                type={alertInfo.type}
                title={alertInfo.title}
                message={alertInfo.alertMessage}
                show={alertInfo.isAlertShow}
                onClose={alertInfo.onClose ?? (() => { })}
                onConfirm={alertInfo.onConfirm ?? (() => { })}
                onCancel={alertInfo.onCancel ?? (() => { })}
                showConfirm={alertInfo.showConfirm}
                showCancel={alertInfo.showCancel}
            />
        </>
    );
};

export default NotifyNotSelectedButton;
