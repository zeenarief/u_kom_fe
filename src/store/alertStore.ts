import { create } from 'zustand';

interface AlertState {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'info' | 'warning';
    onOk?: () => void;

    showAlert: (title: string, message: string, type?: 'error' | 'info' | 'warning', onOk?: () => void) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    onOk: undefined,

    showAlert: (title, message, type = 'error', onOk) =>
        set({ isOpen: true, title, message, type, onOk }),

    closeAlert: () =>
        set({ isOpen: false, title: '', message: '', onOk: undefined }),
}));
