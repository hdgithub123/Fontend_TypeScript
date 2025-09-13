import React from 'react';
import styles from './LoadingOverlay.module.scss';

interface LoadingOverlayProps {
  message?: string;
  onDoubleClick?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Đang xử lý dữ liệu...',
  onDoubleClick,
}) => {
  return (
    <div className={styles.loadingOverlay} onDoubleClick={onDoubleClick}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>{message}</span>
    </div>
  );
};

export default LoadingOverlay;
