import React from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './ConfirmationToast.module.css';

const ConfirmationToast = ({
    t,
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    icon: Icon = AlertTriangle,
    variant = "danger"
}) => {
    return (
        <div className={`${styles.confirmToast} ${t.visible ? styles.animateEnter : styles.animateLeave}`}>
            <div className={styles.confirmHeader}>
                <div className={`${styles.confirmIcon} ${styles[variant]}`}>
                    <Icon size={24} />
                </div>
                <div className={styles.confirmTitle}>{title}</div>
            </div>
            <p className={styles.confirmMessage}>{message}</p>
            <div className={styles.confirmActions}>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        if (onCancel) onCancel();
                    }}
                    className={styles.cancelBtn}
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        if (onConfirm) onConfirm();
                    }}
                    className={`${styles.confirmBtn} ${styles[variant + 'Btn']}`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationToast;
