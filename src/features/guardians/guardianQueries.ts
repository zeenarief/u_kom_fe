import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, ApiError } from '../../types/api';
import type { Guardian, GuardianFormInput } from './types';
import toast from 'react-hot-toast';

// === READ: List Guardians ===
export const useGuardians = (search?: string) => {
    return useQuery({
        queryKey: ['guardians', search],
        queryFn: async () => {
            const params = search ? { q: search } : {};
            const response = await api.get<ApiResponse<Guardian[]>>('/guardians', { params });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    });
};

// === READ DETAIL (Untuk tombol mata) ===
export const useGuardianDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['guardian', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<Guardian>>(`/guardians/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// === CREATE ===
export const useCreateGuardian = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // Ganti tipe data jadi GuardianFormInput
        mutationFn: async (data: GuardianFormInput) => {
            return await api.post('/guardians', data);
        },
        onSuccess: () => {
            toast.success('Data wali berhasil disimpan');
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        }
    });
};

// === UPDATE ===
export const useUpdateGuardian = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // Ganti tipe data jadi GuardianFormInput
        mutationFn: async ({ id, data }: { id: string; data: GuardianFormInput }) => {
            return await api.put(`/guardians/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Data berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update data');
        }
    });
};

// === DELETE ===
export const useDeleteGuardian = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/guardians/${id}`);
        },
        onSuccess: () => {
            toast.success('Data dihapus');
            queryClient.invalidateQueries({ queryKey: ['guardians'] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus data');
        }
    });
};

// === LINK USER ===
export const useLinkGuardianToUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ guardianId, userId }: { guardianId: string; userId: string }) => {
            // Sesuaikan endpoint backend
            return await api.post(`/guardians/${guardianId}/link-user`, { user_id: userId });
        },
        onSuccess: (_, variables) => {
            toast.success('Akun berhasil dihubungkan');
            queryClient.invalidateQueries({ queryKey: ['guardian', variables.guardianId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghubungkan akun');
        }
    });
};

// === UNLINK USER ===
export const useUnlinkGuardianFromUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (guardianId: string) => {
            // Sesuaikan endpoint backend (POST/DELETE)
            return await api.delete(`/guardians/${guardianId}/unlink-user`);
        },
        onSuccess: (_, guardianId) => {
            toast.success('Tautan akun dilepas');
            queryClient.invalidateQueries({ queryKey: ['guardian', guardianId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal melepas tautan');
        }
    });
};

// === EXPORT TO EXCEL ===
export const useExportGuardiansExcel = () => {
    return useMutation({
        mutationFn: async (filters?: { q?: string }) => {
            const response = await api.get('/guardians/export/excel', {
                params: filters,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guardians_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onSuccess: () => {
            toast.success('Data berhasil diexport ke Excel');
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal export Excel');
        }
    });
};

// === EXPORT TO PDF ===
export const useExportGuardiansPDF = () => {
    return useMutation({
        mutationFn: async (filters?: { q?: string }) => {
            const response = await api.get('/guardians/export/pdf', {
                params: filters,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guardians_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onSuccess: () => {
            toast.success('Data berhasil diexport ke PDF');
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal export PDF');
        }
    });
};