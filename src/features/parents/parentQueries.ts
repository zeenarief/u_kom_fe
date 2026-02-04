import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, ApiError } from '../../types/api';
import type { Parent, ParentFormInput } from './types';
import toast from 'react-hot-toast';

// === READ: List Parents ===
export const useParents = (search?: string) => {
    return useQuery({
        queryKey: ['parents', search],
        queryFn: async () => {
            const params = search ? { q: search } : {};
            const response = await api.get<ApiResponse<Parent[]>>('/parents', { params });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
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

// === LINK USER ===
export const useLinkParentToUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ parentId, userId }: { parentId: string; userId: string }) => {
            // Sesuaikan endpoint backend
            return await api.post(`/parents/${parentId}/link-user`, { user_id: userId });
        },
        onSuccess: (_, variables) => {
            toast.success('Akun berhasil dihubungkan');
            queryClient.invalidateQueries({ queryKey: ['parent', variables.parentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghubungkan akun');
        }
    });
};

// === UNLINK USER ===
export const useUnlinkParentFromUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (parentId: string) => {
            // Sesuaikan endpoint backend (POST/DELETE)
            return await api.delete(`/parents/${parentId}/unlink-user`);
        },
        onSuccess: (_, parentId) => {
            toast.success('Tautan akun dilepas');
            queryClient.invalidateQueries({ queryKey: ['parent', parentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal melepas tautan');
        }
    });
};