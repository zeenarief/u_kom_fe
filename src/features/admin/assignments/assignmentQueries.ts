import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../../lib/axios';
import type { ApiResponse, ApiError } from '../../../types/api';
import type { TeachingAssignment, AssignmentFormInput } from './types';
import toast from 'react-hot-toast';

// GET BY CLASSROOM
export const useAssignmentsByClass = (classroomId: string) => {
    return useQuery({
        queryKey: ['assignments', 'class', classroomId],
        queryFn: async () => {
            if (!classroomId) return [];
            const response = await api.get<ApiResponse<TeachingAssignment[]>>(`/assignments/by-class?classroom_id=${classroomId}`);
            return response.data.data;
        },
        enabled: !!classroomId
    });
};

// CREATE
export const useCreateAssignment = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AssignmentFormInput) => {
            return await api.post('/assignments', data);
        },
        onSuccess: (_, variables) => {
            toast.success('Guru berhasil ditugaskan');
            // Refresh list di kelas tersebut
            queryClient.invalidateQueries({ queryKey: ['assignments', 'class', variables.classroom_id] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: AxiosError<ApiError>) => {
            const msg = err.response?.data?.message;
            if (msg === 'Assignment conflict') {
                toast.error('Mapel ini sudah ada gurunya di kelas ini');
            } else {
                toast.error(msg || 'Gagal menyimpan data');
            }
        }
    });
};

// DELETE
export const useDeleteAssignment = (classroomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.delete(`/assignments/${id}`);
        },
        onSuccess: () => {
            toast.success('Penugasan dihapus');
            queryClient.invalidateQueries({ queryKey: ['assignments', 'class', classroomId] });
        },
        onError: () => toast.error('Gagal menghapus data')
    });
};