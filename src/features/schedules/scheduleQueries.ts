import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, Schedule, ScheduleFormInput, ApiError } from '../../types/api';
import toast from 'react-hot-toast';

// GET BY CLASSROOM
export const useSchedulesByClass = (classroomId: string) => {
    return useQuery({
        queryKey: ['schedules', 'class', classroomId],
        queryFn: async () => {
            if (!classroomId) return [];
            const response = await api.get<ApiResponse<Schedule[]>>(`/schedules/by-class?classroom_id=${classroomId}`);
            return response.data.data;
        },
        enabled: !!classroomId
    });
};

// CREATE
export const useCreateSchedule = (classroomId: string, onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ScheduleFormInput) => {
            // Konversi day_of_week string ke number jika dari form HTML
            const payload = {
                ...data,
                day_of_week: Number(data.day_of_week)
            };
            return await api.post('/schedules', payload);
        },
        onSuccess: () => {
            toast.success('Jadwal berhasil dibuat');
            queryClient.invalidateQueries({ queryKey: ['schedules', 'class', classroomId] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            const msg = err.response?.data?.message;
            if (msg?.includes('conflict')) {
                // Tampilkan pesan error spesifik dari backend (misal: "Guru bentrok")
                toast.error(msg, { duration: 5000 });
            } else {
                toast.error(msg || 'Gagal membuat jadwal');
            }
        }
    });
};

// DELETE
export const useDeleteSchedule = (classroomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/schedules/${id}`);
        },
        onSuccess: () => {
            toast.success('Jadwal dihapus');
            queryClient.invalidateQueries({ queryKey: ['schedules', 'class', classroomId] });
        },
        onError: () => toast.error('Gagal menghapus jadwal')
    });
};