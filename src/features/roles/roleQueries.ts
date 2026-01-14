import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type {ApiResponse, Role, RoleDetail, Permission, AssignPermissionsRequest, ApiError, RoleCreateRequest, RoleUpdateRequest} from '../../types/api';
import toast from 'react-hot-toast';

// === READ: Ambil Semua Role ===
export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Role[]>>('/roles');
            return response.data.data;
        },
    });
};

// === READ: Ambil Detail Role (termasuk permissions-nya) ===
export const useRoleDetail = (roleId: string | null) => {
    return useQuery({
        queryKey: ['role', roleId],
        queryFn: async () => {
            if (!roleId) return null;
            const response = await api.get<ApiResponse<RoleDetail>>(`/roles/${roleId}`);
            return response.data.data;
        },
        enabled: !!roleId, // Hanya jalan kalau roleId ada
    });
};

// === READ: Ambil Semua Permission yang Tersedia (Master Data) ===
export const usePermissions = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Permission[]>>('/permissions');
            return response.data.data;
        },
    });
};

// === UPDATE: Sync Permission ke Role ===
export const useSyncRolePermissions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => {
            // Endpoint sesuai OpenAPI Anda: POST /roles/{id}/sync-permissions
            // Payload: { permissions: ["students.read", ...] }
            const payload: AssignPermissionsRequest = { permissions };
            return await api.post(`/roles/${roleId}/sync-permissions`, payload);
        },
        onSuccess: (_, variables) => {
            toast.success('Izin akses berhasil diperbarui!');
            // Refresh detail role agar checkbox terupdate
            queryClient.invalidateQueries({ queryKey: ['role', variables.roleId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update permission');
        }
    });
};

// === CREATE ROLE ===
export const useCreateRole = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // PERBAIKAN: Gunakan RoleCreateRequest
        mutationFn: async (data: RoleCreateRequest) => {
            return await api.post('/roles', data);
        },
        onSuccess: () => {
            toast.success('Role berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal membuat role');
        }
    });
};

// === UPDATE ROLE ===
export const useUpdateRole = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        // PERBAIKAN: Gunakan RoleUpdateRequest
        mutationFn: async ({ id, data }: { id: string; data: RoleUpdateRequest }) => {
            return await api.put(`/roles/${id}`, data);
        },
        onSuccess: (_, variables) => {
            toast.success('Role berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update role');
        }
    });
};

// === DELETE ROLE ===
export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/roles/${id}`);
        },
        onSuccess: () => {
            toast.success('Role berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus role');
        }
    });
};