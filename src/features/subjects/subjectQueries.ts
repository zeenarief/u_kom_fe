import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, Subject, SubjectFormInput, ApiError } from '../../types/api';
import toast from 'react-hot-toast';

// === READ ===
export const useSubjects = () => {
    return useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Subject[]>>('/subjects');
            return response.data.data;
        },
    });
};

// === CREATE ===
export const useCreateSubject = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SubjectFormInput) => {
            return await api.post('/subjects', data);
        },
        onSuccess: () => {
            toast.success('Mata pelajaran berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal membuat mapel');
        }
    });
};

// === UPDATE ===
export const useUpdateSubject = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: SubjectFormInput }) => {
            return await api.put(`/subjects/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Mata pelajaran berhasil diupdate');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal update mapel');
        }
    });
};

// === DELETE ===
export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/subjects/${id}`);
        },
        onSuccess: () => {
            toast.success('Mata pelajaran dihapus');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
        onError: (err: AxiosError<ApiError>) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus mapel');
        }
    });
};