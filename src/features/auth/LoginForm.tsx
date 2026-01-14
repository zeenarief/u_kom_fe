import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

import { AxiosError } from 'axios';
import type {ApiError} from '../../types/api';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import type {LoginRequest, ApiResponse, AuthResponse} from '../../types/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginForm() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginRequest>();

    const onSubmit = async (data: LoginRequest) => {
        try {
            // POST request ke backend
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

            // Simpan data user & token ke Zustand store
            setAuth(response.data.data);

            toast.success(`Selamat datang, ${response.data.data.user.name}!`);
            navigate('/dashboard'); // Redirect

        } catch (err) {
            const error = err as AxiosError<ApiError>;
            console.error('Login Error:', error);
            const msg = error.response?.data?.message || 'Gagal login, periksa koneksi.';
            toast.error(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Input Username/Email */}
            <Input
                label="Username atau Email"
                placeholder="Masukan ID pengguna Anda"
                error={errors.login?.message}
                {...register('login', { required: 'Username/Email wajib diisi' })}
            />

            {/* Input Password dengan Toggle Show/Hide */}
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password', { required: 'Password wajib diisi' })}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-500">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Ingat saya
                </label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Lupa password?
                </a>
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full py-2.5">
                Masuk ke Akun
            </Button>
        </form>
    );
}