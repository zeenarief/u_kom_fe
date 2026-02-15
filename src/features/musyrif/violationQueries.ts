import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { ApiResponse } from '../../types/api'; // Adjust path if needed
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

export const useAllViolations = () => {
    return useQuery({
        queryKey: ['all-violations'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<StudentViolation[]>>('/violations/all');
            return response.data.data;
        },
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
