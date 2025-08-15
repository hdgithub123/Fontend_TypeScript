// AlertDialog.tsx
import React from 'react';
import styles from './AlertDialog.module.scss';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertDialogProps {
    type?: AlertType;
    title?: string;
    message: string;
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    showConfirm?: boolean;
    showCancel?: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    type = 'info',
    title,
    message,
    show,
    onClose,
    onConfirm,
    onCancel,
    showConfirm = true,
    showCancel = true,
}) => {
    if (!show) return null;

    return (
        <div className={`${styles.alertDialog} ${styles[type]}`}>
            <div className={styles.alertHeader}>
                <span className={styles.alertTitle}>{title || type.toUpperCase()}</span>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
            </div>
            <div className={styles.alertBody}>{message}</div>
            <div className={styles.alertActions}>
                {showConfirm && <button onClick={onConfirm}>OK</button>}
                {showCancel && <button onClick={onCancel}>Cancel</button>}
            </div>
        </div>
    );
};

export default AlertDialog;


export interface AlertInfo {
    isAlertShow: boolean;
    alertMessage: string;
    type: AlertType;
    title: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    showConfirm?: boolean,
    showCancel?: boolean,
}