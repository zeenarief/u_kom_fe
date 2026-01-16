import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios'; // Gunakan axios instance kita
import type {ApiError, RegisterRequest} from '../types/api';
import { AxiosError } from 'axios';



export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterRequest>();

    const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
        setIsLoading(true);
        try {
            // Hit endpoint public register
            await api.post('/auth/register', data);

            toast.success('Registrasi berhasil! Silakan login.');
            // Redirect ke halaman login setelah berhasil
            navigate('/login');
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            const msg = error.response?.data?.message || 'Registrasi gagal. Coba lagi.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-blue-600">
                    <GraduationCap size={48} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Daftar Akun Baru
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Bergabung dengan Sistem Informasi Sekolah
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    {...register('name', { required: 'Nama lengkap wajib diisi' })}
                                    type="text"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Fingerprint size={18} />
                                </div>
                                <input
                                    {...register('username', {
                                        required: 'Username wajib diisi',
                                        minLength: { value: 3, message: 'Minimal 3 karakter' }
                                    })}
                                    type="text"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.username ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="budi123"
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    {...register('email', {
                                        required: 'Email wajib diisi',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Format email salah' }
                                    })}
                                    type="email"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="email@contoh.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    {...register('password', {
                                        required: 'Password wajib diisi',
                                        minLength: { value: 8, message: 'Minimal 8 karakter' },
                                        // Opsional: Validasi regex frontend (kalau mau UX lebih cepat)
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
                                            message: 'Harus ada huruf besar, kecil, dan angka'
                                        }
                                    })}
                                    type="password"
                                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="********"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        {/* Tombol Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>

                    {/* Link ke Login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Sudah punya akun?</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Masuk / Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}