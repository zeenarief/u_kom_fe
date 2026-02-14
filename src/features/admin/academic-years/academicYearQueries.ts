import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../../lib/axios';
import type { ApiResponse, ApiError } from '../../../types/api';
import type { AcademicYear, AcademicYearFormInput } from './types';
import toast from 'react-hot-toast';

// === READ ===
export const useAcademicYears = () => {
    return useQuery({
        queryKey: ['academic-years'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<AcademicYear[]>>('/academic-years');
            return response.data.data;
        },
    });
};

// === CREATE ===
export const useCreateAcademicYear = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AcademicYearFormInput) => {
            return await api.post('/academic-years', data);
        },
        onSuccess: () => {
            toast.success('Tahun ajaran berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal membuat data');
        }
    });
};

// === UPDATE ===
export const useUpdateAcademicYear = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: AcademicYearFormInput }) => {
            return await api.put(`/academic-years/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Tahun ajaran berhasil diupdate');
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal update data');
        }
    });
};

// === DELETE ===
export const useDeleteAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/academic-years/${id}`);
        },
        onSuccess: () => {
            toast.success('Tahun ajaran dihapus');
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus data');
        }
    });
};

// === ACTIVATE (Fitur Khusus) ===
export const useActivateAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.patch(`/academic-years/${id}/activate`);
        },
        onSuccess: () => {
            toast.success('Tahun ajaran AKTIF');
            // Refresh list agar status yang lain jadi INACTIVE
            queryClient.invalidateQueries({ queryKey: ['academic-years'] });
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal mengaktifkan');
        }
    });
};