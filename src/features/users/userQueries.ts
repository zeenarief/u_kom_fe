import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, ApiError } from '../../types/api';
import type { User } from './types';
import type { RegisterRequest } from '../../types/auth';
import type { Role } from '../roles/types';
import toast from 'react-hot-toast';

// === READ: Ambil Semua User ===
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<User[]>>('/users');
            return response.data.data;
        },
    });
};

// === READ: Detail User ===
export const useUserDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<User>>(`/users/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// === READ: Ambil Role ===
export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Role[]>>('/roles');
            return response.data.data;
        },
    });
};

// === CREATE: Tambah User ===
interface CreateUserPayload extends RegisterRequest {
    role_ids: string[];
}

export const useCreateUser = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newUser: CreateUserPayload) => {
            return await api.post('/users', newUser);
        },
        onSuccess: () => {
            toast.success('User berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal membuat user');
        }
    });
};

// === UPDATE: Edit User ===
// Kita butuh tipe data khusus untuk update (password opsional)
export interface UpdateUserPayload {
    name?: string;
    username?: string;
    email?: string;
    password?: string; // Opsional jika tidak ingin ganti password
    role_ids?: string[];
}

export const useUpdateUser = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateUserPayload }) => {
            return await api.put(`/users/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Data user berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update user');
        }
    });
};

// === DELETE: Hapus User ===
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            toast.success('User berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
            toast.error('Gagal menghapus user');
        }
    });
};