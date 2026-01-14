import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Hapus token dari state/storage
        toast.success('Anda telah keluar.');
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 md:left-64 z-10 px-6 flex items-center justify-between">
            {/* Kiri: Breadcrumb (Opsional, dikosongkan dulu) */}
            <div className="text-sm text-gray-500 hidden sm:block">
                Selamat Datang di Panel Admin
            </div>

            {/* Kanan: Profil & Logout */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-right">
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.roles?.[0]?.name || 'User'}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <UserIcon size={16} />
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Keluar"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;