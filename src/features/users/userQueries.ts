import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type {ApiResponse, User, RegisterRequest, Role, ApiError} from '../../types/api';
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

// === READ: Ambil Role (Untuk Dropdown Form) ===
export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Role[]>>('/roles');
            return response.data.data;
        },
    });
};

// === CREATE: Tambah User Baru ===
// Kita extend RegisterRequest karena di Backend butuh role_ids juga saat Create Admin
interface CreateUserPayload extends RegisterRequest {
    role_ids: string[];
}

export const useCreateUser = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newUser: CreateUserPayload) => {
            // Endpoint POST /users (khusus admin, beda dengan /auth/register publik)
            return await api.post('/users', newUser);
        },
        onSuccess: () => {
            toast.success('User berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Refresh tabel otomatis
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            const msg = error.response?.data?.message || 'Gagal membuat user';
            toast.error(msg);
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