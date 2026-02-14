import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, ApiError } from '../../types/api';
import type { AttendanceSubmitRequest, AttendanceSession } from '../admin/schedules/types';
import toast from 'react-hot-toast';

// === SUBMIT ATTENDANCE ===
export const useSubmitAttendance = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AttendanceSubmitRequest) => {
            const response = await api.post('/attendances', data);
            return response.data.data;
        },
        onSuccess: () => { // Ambil variables untuk tau schedule & date jika perlu
            toast.success('Presensi berhasil disimpan');

            // === PERBAIKAN DI SINI ===
            // 1. Hapus cache spesifik untuk pengecekan sesi ini agar saat modal dibuka lagi, dia fetch ulang
            queryClient.invalidateQueries({
                queryKey: ['attendance-check']
            });

            // 2. Refresh history (jika ada list riwayat di halaman lain)
            queryClient.invalidateQueries({ queryKey: ['attendance-history'] });

            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            const msg = err.response?.data?.message;
            if (msg?.includes('already exists')) {
                toast.error('Presensi untuk jadwal ini sudah diisi hari ini.');
            } else {
                toast.error(msg || 'Gagal menyimpan presensi');
            }
        }
    });
};

export const useCheckAttendanceSession = (scheduleId: string | undefined, date: string) => {
    return useQuery({
        queryKey: ['attendance-check', scheduleId, date],
        queryFn: async () => {
            if (!scheduleId || !date) return null;

            const response = await api.get<ApiResponse<AttendanceSession | null>>(`/attendances/check?schedule_id=${scheduleId}&date=${date}`);

            // PERBAIKAN: Gunakan '?? null'
            // Jika response.data.data undefined, ganti jadi null.
            return response.data.data ?? null;
        },
        enabled: !!scheduleId && !!date,
        retry: false
    });
};