import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../../lib/axios';
import type { ApiResponse, ApiError, PaginatedResponse } from '../../../types/api';
import type { Employee, EmployeeFormInput } from './types';
import toast from 'react-hot-toast';

// === READ: List ===
export const useEmployees = (params?: { page?: number; limit?: number; q?: string }) => {
    return useQuery({
        queryKey: ['employees', JSON.stringify(params)],
        queryFn: async () => {
            const response = await api.get<ApiResponse<PaginatedResponse<Employee>>>('/employees', { params });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    });
};

// === READ: Detail ===
export const useEmployeeDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

// === CREATE ===
export const useCreateEmployee = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: EmployeeFormInput) => {
            return await api.post('/employees', data);
        },
        onSuccess: () => {
            toast.success('Data pegawai berhasil disimpan');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menyimpan data');
        }
    });
};

// === UPDATE ===
export const useUpdateEmployee = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: EmployeeFormInput }) => {
            return await api.put(`/employees/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Data pegawai diperbarui');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            if (onSuccess) onSuccess();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal update data');
        }
    });
};

// === DELETE ===
export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/employees/${id}`);
        },
        onSuccess: () => {
            toast.success('Data pegawai dihapus');
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus data');
        }
    });
};

// === LINK USER ===
export const useLinkEmployeeToUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ employeeId, userId }: { employeeId: string; userId: string }) => {
            return await api.post(`/employees/${employeeId}/link-user`, { user_id: userId });
        },
        onSuccess: (_, variables) => {
            toast.success('Akun berhasil dihubungkan');
            queryClient.invalidateQueries({ queryKey: ['employee', variables.employeeId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghubungkan akun');
        }
    });
};

// === UNLINK USER ===
export const useUnlinkEmployeeFromUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (employeeId: string) => {
            return await api.delete(`/employees/${employeeId}/unlink-user`);
        },
        onSuccess: (_, employeeId) => {
            toast.success('Tautan akun dilepas');
            queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal melepas tautan');
        }
    });
};