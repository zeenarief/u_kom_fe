import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type {ApiResponse, Student, StudentFormInput, ApiError, LinkUserRequest} from '../../types/api';
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

// === LINK: Hubungkan Siswa ke User ===
export const useLinkStudentToUser = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ studentId, userId }: { studentId: string; userId: string }) => {
            const payload: LinkUserRequest = { user_id: userId };
            // Sesuaikan endpoint dengan dokumentasi backend Anda.
            // Biasanya: POST /students/{id}/link-user
            return await api.post(`/students/${studentId}/link-user`, payload);
        },
        onSuccess: (_, variables) => {
            toast.success('Akun berhasil dihubungkan!');
            // Refresh detail siswa agar data user muncul
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
            // Refresh list juga jika perlu
            queryClient.invalidateQueries({ queryKey: ['students'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghubungkan akun');
        }
    });
};

// === UNLINK: Putuskan Hubungan Siswa dengan User ===
export const useUnlinkStudentFromUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (studentId: string) => {
            // Sesuaikan endpoint dengan routing backend Anda.
            // Biasanya: POST /students/{id}/unlink-user atau DELETE /students/{id}/user
            return await api.delete(`/students/${studentId}/unlink-user`, {});
        },
        onSuccess: (_, studentId) => {
            toast.success('Tautan akun berhasil dihapus');
            // Refresh detail siswa agar kembali ke tampilan dropdown
            queryClient.invalidateQueries({ queryKey: ['student', studentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus tautan akun');
        }
    });
};
