import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import type {ApiResponse, DashboardStats} from '../../types/api';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
            return response.data.data;
        },
        // Refresh otomatis setiap 1 menit biar kelihatan live (opsional)
        refetchInterval: 60000
    });
};