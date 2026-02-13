import { useAuthStore } from '../../store/authStore';
import { AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnregisteredDashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-50 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Akun Belum Aktif</h1>
                <p className="text-gray-600 mb-6">
                    Halo, <span className="font-semibold text-gray-900">{user?.name}</span>.
                    Akun Anda saat ini belum memiliki role atau akses yang aktif.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-500 mb-8 border border-gray-100">
                    <p>Silakan hubungi Administrator Sekolah untuk mengaktifkan akun dan memberikan akses yang sesuai.</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition"
                >
                    <LogOut size={18} />
                    Keluar Aplikasi
                </button>
            </div>
        </div>
    );
};

export default UnregisteredDashboard;
