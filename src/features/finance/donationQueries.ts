import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../lib/axios';
import type { CreateDonationRequest, Donation, Donor } from './types';
import type { PaginatedResponse } from '../../types/api';
import toast from 'react-hot-toast';

// Keys
export const donationKeys = {
    all: ['donations'] as const,
    lists: () => [...donationKeys.all, 'list'] as const,
    list: (filters: string) => [...donationKeys.lists(), { filters }] as const,
    details: () => [...donationKeys.all, 'detail'] as const,
    detail: (id: string) => [...donationKeys.details(), id] as const,
    donors: ['donors'] as const,
    donorsList: (filters: string) => [...donationKeys.donors, 'list', { filters }] as const,
    donorDetails: () => [...donationKeys.donors, 'detail'] as const,
    donorDetail: (id: string) => [...donationKeys.donorDetails(), id] as const,
};

// --- Single Item Queries ---

export const useDonation = (id: string) => {
    return useQuery({
        queryKey: donationKeys.detail(id),
        queryFn: async () => {
            const { data } = await axios.get<{ data: import('./types').Donation }>(`/finance/donations/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
};

export const useDonor = (id: string) => {
    return useQuery({
        queryKey: donationKeys.donorDetail(id),
        queryFn: async () => {
            const { data } = await axios.get<{ data: import('./types').Donor }>(`/finance/donors/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
};

// --- Donations ---

export const useDonations = (params?: { page?: number; limit?: number; type?: string; donor_id?: string; date_from?: string; date_to?: string; q?: string }) => {
    return useQuery({
        queryKey: donationKeys.list(JSON.stringify(params)),
        queryFn: async () => {
            const { data } = await axios.get<{ data: PaginatedResponse<Donation> }>('/finance/donations', { params });
            return data.data;
        }
    });
};

export const useCreateDonation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newDonation: CreateDonationRequest) => {
            const formData = new FormData();
            formData.append('donor_name', newDonation.donor_name);
            if (newDonation.donor_phone) formData.append('donor_phone', newDonation.donor_phone);
            if (newDonation.donor_email) formData.append('donor_email', newDonation.donor_email);
            if (newDonation.donor_address) formData.append('donor_address', newDonation.donor_address);
            formData.append('type', newDonation.type);
            formData.append('payment_method', newDonation.payment_method);
            if (newDonation.total_amount) formData.append('total_amount', newDonation.total_amount.toString());
            if (newDonation.description) formData.append('description', newDonation.description);
            if (newDonation.proof_file) formData.append('proof_file', newDonation.proof_file);
            if (newDonation.items_json) formData.append('items_json', newDonation.items_json);

            const { data } = await axios.post('/finance/donations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data;
        },
        onSuccess: () => {
            toast.success('Donasi berhasil dicatat');
            queryClient.invalidateQueries({ queryKey: donationKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal mencatat donasi');
        }
    });
};

// --- Donors ---

export const useDonors = (params?: { page?: number; limit?: number; name?: string; q?: string }) => {
    return useQuery({
        queryKey: donationKeys.donorsList(JSON.stringify(params)),
        queryFn: async () => {
            const { data } = await axios.get<{ data: PaginatedResponse<Donor> }>('/finance/donors', { params });
            return data.data;
        }
    });
};
// --- Mutations ---

export const useCreateDonor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newDonor: import('./types').CreateDonorRequest) => {
            const response = await axios.post('/finance/donors', newDonor);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Donatur berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: donationKeys.donors });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal menambahkan donatur');
        }
    });
};

export const useUpdateDonation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: import('./types').UpdateDonationRequest) => {
            const formData = new FormData();
            if (data.donor_name) formData.append('donor_name', data.donor_name);
            if (data.donor_phone) formData.append('donor_phone', data.donor_phone);
            if (data.donor_address) formData.append('donor_address', data.donor_address);
            if (data.type) formData.append('type', data.type);
            if (data.payment_method) formData.append('payment_method', data.payment_method);
            if (data.total_amount) formData.append('total_amount', data.total_amount.toString());
            if (data.description) formData.append('description', data.description);
            // Handle file only if new one is provided
            if (data.proof_file) formData.append('proof_file', data.proof_file);
            if (data.items_json) formData.append('items_json', data.items_json);

            const response = await axios.put(`/finance/donations/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Donasi berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: donationKeys.all });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal memperbarui donasi');
        }
    });
};

export const useUpdateDonor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: import('./types').UpdateDonorRequest) => {
            const response = await axios.put(`/finance/donors/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Data donatur berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: donationKeys.donors });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Gagal memperbarui data donatur');
        }
    });
};
