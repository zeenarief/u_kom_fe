// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';

// URL Backend Golang (Pastikan portnya sesuai)
const BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. REQUEST INTERCEPTOR: Menyelipkan Token di setiap request
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Handle Token Expired (Auto Refresh)
api.interceptors.response.use(
    (response) => response, // Jika sukses, loloskan
    async (error) => {
        const originalRequest = error.config;
        const { showAlert } = useAlertStore.getState(); // Get action without hook

        // Handle Network Errors (Server Down / No Internet)
        if (!error.response && error.code === "ERR_NETWORK") {
            showAlert(
                "Koneksi Gagal",
                "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.",
                "error"
            );
            return Promise.reject(error);
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            showAlert(
                "Server Error",
                "Terjadi kesalahan internal pada server. Silakan hubungi admin.",
                "error"
            );
        }

        // Jika error 401 (Unauthorized) dan belum pernah diretry sebelumnya
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Panggil endpoint refresh token backend
                // Warning: Ini menggunakan axios biasa (bukan instance 'api') untuk menghindari loop
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                // Backend mengembalikan struktur: { data: { access_token, ... } }
                const newAuthData = response.data.data;

                // Simpan token baru ke store
                useAuthStore.getState().setAuth(newAuthData);

                // Update header request yang gagal tadi dengan token baru
                originalRequest.headers.Authorization = `Bearer ${newAuthData.access_token}`;

                // Ulangi request awal yang sempat gagal
                return api(originalRequest);

            } catch (refreshError) {
                // Jika refresh gagal (token benar-benar hangus), logout paksa
                useAuthStore.getState().logout();

                showAlert(
                    "Sesi Habis",
                    "Sesi login Anda telah berakhir. Silakan login kembali untuk melanjutkan.",
                    "warning",
                    () => {
                        window.location.href = '/login';
                    }
                );

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;