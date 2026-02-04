import LoginForm from '../features/auth/LoginForm';
import { GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { useAlertStore } from '../store/alertStore';

export default function LoginPage() {
    const { closeAlert } = useAlertStore();

    // Reset alert jika ada sisa alert dari sesi sebelumnya (misal race condition saat logout)
    useEffect(() => {
        closeAlert();
    }, [closeAlert]);

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* SEKSI KIRI: Branding / Hero Image (Hidden di Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                    alt="School Background"
                    className="absolute w-full h-full object-cover"
                />

                {/* Konten Text Branding */}
                <div className="relative z-20 text-white px-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                            <GraduationCap size={64} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Sistem Informasi Sekolah</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Platform terintegrasi untuk manajemen data siswa, guru, dan akademik yang lebih efisien, transparan, dan modern.
                    </p>
                </div>
            </div>

            {/* SEKSI KANAN: Form Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

                    <div className="text-center mb-8">
                        {/* Icon untuk Mobile (Visible only on small screens) */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <GraduationCap size={32} className="text-blue-600" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Silakan masukan kredensial akun Anda untuk melanjutkan.
                        </p>
                    </div>

                    {/* Panggil Logic Form Disini */}
                    <LoginForm />

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Belum memiliki akun?{' '}
                        <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Daftar Akun Baru
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}