import { create } from 'zustand';

interface AlertState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'info' | 'warning' | 'success'; // added success for completeness if needed, but sticking to existing + check
    onOk?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;

    showAlert: (
        title: string,
        message: string,
        type?: 'error' | 'info' | 'warning',
        onOk?: () => void,
        onCancel?: () => void,
        confirmText?: string,
        cancelText?: string
    ) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    onOk: undefined,
    onCancel: undefined,
    confirmText: 'OK',
    cancelText: 'Batal',

    showAlert: (title, message, type = 'error', onOk, onCancel, confirmText = 'OK', cancelText = 'Batal') =>
        set({ isOpen: true, title, message, type, onOk, onCancel, confirmText, cancelText }),

    closeAlert: () =>
        set({ isOpen: false, title: '', message: '', onOk: undefined, onCancel: undefined }),
}));
