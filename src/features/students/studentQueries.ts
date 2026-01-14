import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type {ApiResponse, Student, StudentFormInput, ApiError} from '../../types/api';
import toast from 'react-hot-toast';

// === READ: List Siswa ===
export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Student[]>>('/students');
            return response.data.data;
        },
    });
};

// === READ: Ambil Detail Siswa by ID ===
export const useStudentDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['student', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<Student>>(`/students/${id}`);
            return response.data.data;
        },
        enabled: !!id, // Query hanya jalan jika ID tidak null
    });
};

// === CREATE: Tambah Siswa ===
export const useCreateStudent = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: StudentFormInput) => {
            return await api.post('/students', data);
        },
        onSuccess: () => {
            toast.success('Data siswa berhasil disimpan');
            queryClient.invalidateQueries({ queryKey: ['students'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            const msg = error.response?.data?.message || 'Gagal menyimpan siswa';
            toast.error(msg);
        }
    });
};

// === UPDATE: Edit Siswa ===
export const useUpdateStudent = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: StudentFormInput }) => {
            return await api.put(`/students/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Data siswa berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['students'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            const msg = error.response?.data?.message || 'Gagal update siswa';
            toast.error(msg);
        }
    });
};

// === DELETE: Hapus Siswa ===
export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/students/${id}`);
        },
        onSuccess: () => {
            toast.success('Data siswa dihapus');
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
        onError: () => {
            toast.error('Gagal menghapus data siswa');
        }
    });
};