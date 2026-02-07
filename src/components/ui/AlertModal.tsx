import React from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Info } from 'lucide-react';
import { useAlertStore } from '../../store/alertStore';

const AlertModal: React.FC = () => {
    const { isOpen, title, message, type, closeAlert, onOk, onCancel, confirmText, cancelText } = useAlertStore();

    if (!isOpen) return null;

    const handleOk = () => {
        closeAlert();
        if (onOk) onOk();
    };

    const handleCancel = () => {
        closeAlert();
        if (onCancel) onCancel();
    };

    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AlertCircle className="h-12 w-12 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-12 w-12 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="h-12 w-12 text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'error': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
            default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm transform rounded-lg bg-white p-6 shadow-xl transition-all animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                        {getIcon()}
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-gray-900 leading-snug">
                        {title}
                    </h3>

                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                    </div>

                    <div className="mt-6 w-full flex gap-3">
                        {onCancel && (
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm transition-colors"
                                onClick={handleCancel}
                            >
                                {cancelText || 'Batal'}
                            </button>
                        )}
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors ${getButtonColor()}`}
                            onClick={handleOk}
                        >
                            {confirmText || 'OK'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AlertModal;
