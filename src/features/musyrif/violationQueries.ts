import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { ApiResponse, PaginatedResponse } from '../../types/api'; // Adjust path if needed
import toast from 'react-hot-toast';
import type {
    ViolationCategory,
    ViolationType,
    StudentViolation,
    CreateCategoryPayload,
    UpdateCategoryPayload,
    CreateTypePayload,
    UpdateTypePayload,
    CreateViolationPayload
} from './types';

// === CATEGORIES ===

export const useViolationCategories = () => {
    return useQuery({
        queryKey: ['violation-categories'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<ViolationCategory[]>>('/violations/categories');
            return response.data.data;
        },
    });
};

export const useCreateViolationCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateCategoryPayload) => {
            return await api.post('/violations/categories', data);
        },
        onSuccess: () => {
            toast.success('Kategori pelanggaran berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['violation-categories'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal membuat kategori');
        }
    });
};

export const useDeleteViolationCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/violations/categories/${id}`);
        },
        onSuccess: () => {
            toast.success('Kategori berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['violation-categories'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus kategori');
        }
    });
};

export const useUpdateViolationCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryPayload }) => {
            return await api.put(`/violations/categories/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Kategori berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['violation-categories'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memperbarui kategori');
        }
    });
};

// === TYPES (Jenis Pelanggaran) ===

export const useViolationTypes = () => {
    return useQuery({
        queryKey: ['violation-types'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<ViolationType[]>>('/violations/types');
            return response.data.data;
        },
    });
};

export const useCreateViolationType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateTypePayload) => {
            return await api.post('/violations/types', data);
        },
        onSuccess: () => {
            toast.success('Jenis pelanggaran berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['violation-types'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal membuat jenis pelanggaran');
        }
    });
};

export const useDeleteViolationType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/violations/types/${id}`);
        },
        onSuccess: () => {
            toast.success('Jenis pelanggaran berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['violation-types'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus jenis pelanggaran');
        }
    });
};

export const useUpdateViolationType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateTypePayload }) => {
            return await api.put(`/violations/types/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Jenis pelanggaran berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['violation-types'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memperbarui jenis pelanggaran');
        }
    });
};

// === STUDENT VIOLATIONS (Pencatatan) ===

export const useViolationsByStudent = (studentId: string) => {
    return useQuery({
        queryKey: ['student-violations', studentId],
        queryFn: async () => {
            if (!studentId) return [];
            const response = await api.get<ApiResponse<StudentViolation[]>>(`/violations/student/${studentId}`);
            return response.data.data;
        },
        enabled: !!studentId,
    });
};

export const useAllViolations = (params?: { page?: number; limit?: number; q?: string }) => {
    return useQuery({
        queryKey: ['all-violations', JSON.stringify(params)],
        queryFn: async () => {
            const response = await api.get<ApiResponse<PaginatedResponse<StudentViolation>>>('/violations/all', { params });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    });
};


export const useCreateViolation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateViolationPayload) => {
            return await api.post('/violations/record', data);
        },
        onSuccess: (_, variables) => {
            toast.success('Pelanggaran berhasil dicatat');
            queryClient.invalidateQueries({ queryKey: ['student-violations', variables.student_id] });
            queryClient.invalidateQueries({ queryKey: ['all-violations'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal mencatat pelanggaran');
        }
    });
};

export const useDeleteViolation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/violations/record/${id}`);
        },
        onSuccess: () => {
            toast.success('Data pelanggaran berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['student-violations'] });
            queryClient.invalidateQueries({ queryKey: ['all-violations'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal menghapus data pelanggaran');
        }
    });
};
// === SINGLE VIOLATION & UPDATE ===

export const useViolation = (id: string) => {
    return useQuery({
        queryKey: ['violation', id],
        queryFn: async () => {
            const response = await api.get<ApiResponse<StudentViolation>>(`/violations/record/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
};

export const useUpdateViolation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CreateViolationPayload }) => {
            return await api.put(`/violations/record/${id}`, data);
        },
        onSuccess: (_data, variables) => {
            toast.success('Data pelanggaran berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['violation', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['all-violations'] });
            queryClient.invalidateQueries({ queryKey: ['student-violations'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memperbarui data pelanggaran');
        }
    });
};
