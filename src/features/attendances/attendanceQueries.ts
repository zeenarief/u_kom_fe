import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { AttendanceSubmitRequest, ApiError } from '../../types/api';
import toast from 'react-hot-toast';

// === SUBMIT ATTENDANCE ===
export const useSubmitAttendance = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AttendanceSubmitRequest) => {
            const response = await api.post('/attendances', data);
            return response.data.data;
        },
        onSuccess: () => {
            toast.success('Presensi berhasil disimpan');
            // Invalidate queries jika nanti kita punya list history presensi
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