import toast from 'react-hot-toast';
import ConfirmationToast from '../components/ui/ConfirmationToast';

/**
 * Shows a custom confirmation toast.
 * @param {Object} options
 * @param {string} options.title - Toast title
 * @param {string} options.message - Confirmation message
 * @param {Function} options.onConfirm - Callback when confirmed
 * @param {Function} [options.onCancel] - Callback when cancelled
 * @param {string} [options.confirmText] - Label for confirm button
 * @param {string} [options.cancelText] - Label for cancel button
 * @param {React.ComponentType} [options.icon] - Lucide icon component
 * @param {string} [options.variant] - 'danger' | 'warning' | 'primary'
 */
export const confirmAction = (options) => {
    toast.custom((t) => (
        <ConfirmationToast
            t={t}
            {...options}
        />
    ), {
        position: 'top-center',
        duration: 5000,
    });
};
