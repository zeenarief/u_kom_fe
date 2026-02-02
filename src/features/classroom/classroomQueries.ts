import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { ApiResponse, Classroom, ClassroomDetail, ClassroomFormInput, AddStudentsRequest } from '../../types/api';
import toast from 'react-hot-toast';

// GET LIST (Filter by Academic Year)
export const useClassrooms = (academicYearId: string) => {
    return useQuery({
        queryKey: ['classrooms', academicYearId],
        queryFn: async () => {
            // Backend support filter: ?academic_year_id=...
            const params = new URLSearchParams();
            if (academicYearId) params.append('academic_year_id', academicYearId);

            const response = await api.get<ApiResponse<Classroom[]>>(`/classrooms?${params.toString()}`);
            return response.data.data;
        },
        enabled: !!academicYearId // Hanya fetch jika tahun ajaran dipilih
    });
};

// GET DETAIL (Info Kelas + Daftar Siswa)
export const useClassroomDetail = (id: string | null) => {
    return useQuery({
        queryKey: ['classroom', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<ApiResponse<ClassroomDetail>>(`/classrooms/${id}`);
            return response.data.data;
        },
        enabled: !!id
    });
};

// CREATE
export const useCreateClassroom = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ClassroomFormInput) => {
            return await api.post('/classrooms', data);
        },
        onSuccess: () => {
            toast.success('Kelas berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: () => toast.error('Gagal membuat kelas')
    });
};

// UPDATE
export const useUpdateClassroom = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ClassroomFormInput> }) => {
            return await api.put(`/classrooms/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Kelas berhasil diupdate');
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: () => toast.error('Gagal update kelas')
    });
};

// DELETE
export const useDeleteClassroom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/classrooms/${id}`);
        },
        onSuccess: () => {
            toast.success('Kelas dihapus');
            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        },
        onError: () => toast.error('Gagal menghapus kelas')
    });
};

// === MANAGE STUDENTS ===

// ADD STUDENTS
export const useAddStudentsToClass = (classroomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (studentIds: string[]) => {
            const payload: AddStudentsRequest = { student_ids: studentIds };
            return await api.post(`/classrooms/${classroomId}/students`, payload);
        },
        onSuccess: async () => {
            toast.success('Siswa berhasil ditambahkan');

            // 1. Refresh Data Detail (Untuk Modal agar list siswa update)
            await queryClient.invalidateQueries({ queryKey: ['classroom', classroomId] });

            // 2. Refresh List Utama (Untuk Halaman Depan agar angka total_students update)
            // Kita invalidate key 'classrooms' agar mencakup semua variasi filternya
            await queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        },
        onError: () => toast.error('Gagal menambahkan siswa')
    });
};

// REMOVE STUDENT
export const useRemoveStudentFromClass = (classroomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (studentId: string) => {
            return await api.delete(`/classrooms/${classroomId}/students/${studentId}`);
        },
        onSuccess: async () => {
            toast.success('Siswa dikeluarkan dari kelas');

            // 1. Refresh Detail
            await queryClient.invalidateQueries({ queryKey: ['classroom', classroomId] });

            // 2. Refresh List Utama
            await queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        },
        onError: () => toast.error('Gagal menghapus siswa')
    });
};