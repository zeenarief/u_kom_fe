import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type {ApiResponse, Parent, ParentFormInput, ApiError} from '../../types/api';
import toast from 'react-hot-toast';

// === READ: List Parents ===
export const useParents = () => {
    return useQuery({
        queryKey: ['parents'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Parent[]>>('/parents');
            return response.data.data;
        },
    });
};

// === READ DETAIL (Untuk tombol mata) ===
export const useParentDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['parent', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<Parent>>(`/parents/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// === CREATE ===
export const useCreateParent = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // Ganti tipe data jadi ParentFormInput
        mutationFn: async (data: ParentFormInput) => {
            return await api.post('/parents', data);
        },
        onSuccess: () => {
            toast.success('Data orang tua berhasil disimpan');
            queryClient.invalidateQueries({ queryKey: ['parents'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        }
    });
};

// === UPDATE ===
export const useUpdateParent = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // Ganti tipe data jadi ParentFormInput
        mutationFn: async ({ id, data }: { id: string; data: ParentFormInput }) => {
            return await api.put(`/parents/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Data berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['parents'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update data');
        }
    });
};

// === DELETE ===
export const useDeleteParent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/parents/${id}`);
        },
        onSuccess: () => {
            toast.success('Data dihapus');
            queryClient.invalidateQueries({ queryKey: ['parents'] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus data');
        }
    });
};