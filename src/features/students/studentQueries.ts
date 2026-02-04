import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { ApiResponse, ApiError } from '../../types/api';
import type {
    Student,
    StudentFormInput,
    LinkUserRequest,
    StudentParentSyncRequest,
    SetGuardianRequest
} from './types'; import toast from 'react-hot-toast';

// === READ: List Siswa ===
export const useStudents = (search?: string) => {
    return useQuery({
        queryKey: ['students', search],
        queryFn: async () => {
            const params = search ? { q: search } : {};
            const response = await api.get<ApiResponse<Student[]>>('/students', { params });
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

// === SYNC PARENTS ===
export const useSyncStudentParents = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ studentId, data }: { studentId: string; data: StudentParentSyncRequest }) => {
            // Endpoint backend: POST /students/:id/sync-parents
            return await api.post(`/students/${studentId}/sync-parents`, data);
        },
        onSuccess: (_, variables) => {
            toast.success('Data keluarga berhasil disimpan');
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menyimpan data keluarga');
        }
    });
};

// === SET GUARDIAN (Polymorphic) ===
export const useSetGuardian = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ studentId, data }: { studentId: string; data: SetGuardianRequest }) => {
            // Endpoint: PUT /students/:id/set-guardian
            return await api.put(`/students/${studentId}/set-guardian`, data);
        },
        onSuccess: (_, variables) => {
            toast.success('Wali utama berhasil ditetapkan');
            queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menetapkan wali');
        }
    });
};

// === REMOVE GUARDIAN ===
export const useRemoveGuardian = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (studentId: string) => {
            // Endpoint: DELETE /students/:id/remove-guardian
            return await api.delete(`/students/${studentId}/remove-guardian`);
        },
        onSuccess: (_, studentId) => {
            toast.success('Wali utama dihapus');
            queryClient.invalidateQueries({ queryKey: ['student', studentId] });
        },
        onError: (err) => {
            const error = err as AxiosError<ApiError>;
            toast.error(error.response?.data?.message || 'Gagal menghapus wali');
        }
    });
};

// === EXPORT EXCEL ===
export const useExportStudents = () => {
    return useMutation({
        mutationFn: async () => {
            // PENTING: responseType: 'blob' agar axios menanggapinya sebagai file/binary
            const response = await api.get('/students/export/excel', {
                responseType: 'blob',
            });
            return response;
        },
        onSuccess: (response) => {
            // Trik JavaScript untuk memicu download file dari Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Ambil nama file dari header jika ada, atau default
            // (Header content-disposition agak tricky diambil jika CORS tidak diset expose-headers)
            // Kita pakai default nama file saja biar aman
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `Students_Export_${date}.xlsx`);

            document.body.appendChild(link);
            link.click();

            // Bersihkan
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Data berhasil diunduh');
        },
        onError: () => {
            toast.error('Gagal mengunduh file');
        }
    });
};

// === EXPORT PDF ===
export const useExportStudentsPDF = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await api.get('/students/export/pdf', {
                responseType: 'blob', // Penting
            });
            return response;
        },
        onSuccess: (response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `Laporan_Siswa_${date}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('PDF berhasil diunduh');
        },
        onError: () => {
            toast.error('Gagal mengunduh PDF');
        }
    });
};

// === EXPORT BIODATA (SINGLE) ===
export const useExportStudentBiodata = () => {
    return useMutation({
        // Ubah parameter input menjadi object { id, name }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        mutationFn: async ({ id, name: _name }: { id: string; name: string }) => {
            const response = await api.get(`/students/${id}/export/pdf`, {
                responseType: 'blob',
            });
            return response;
        },
        // Parameter ke-2 di onSuccess adalah 'variables' (input yang kita kirim saat mutate)
        onSuccess: (response, variables) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Sanitasi nama file: Ganti spasi dengan underscore, hapus karakter aneh
            const safeName = variables.name.replace(/[^a-zA-Z0-9]/g, '_');

            // Set nama file dinamis
            link.setAttribute('download', `Biodata_${safeName}.pdf`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Biodata berhasil diunduh');
        },
        onError: () => {
            toast.error('Gagal mengunduh biodata');
        }
    });
};