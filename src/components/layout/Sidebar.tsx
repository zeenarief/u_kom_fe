import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    UserSquare2,
    Briefcase,
    Settings, Shield
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    // Daftar Menu Navigasi
    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Manajemen User', path: '/dashboard/users', icon: Users },
        { label: 'Data Siswa', path: '/dashboard/students', icon: GraduationCap },
        { label: 'Data Orang Tua', path: '/dashboard/parents', icon: UserSquare2 },
        { label: 'Data Wali', path: '/dashboard/guardians', icon: Shield },
        { label: 'Data Guru & Tendik', path: '/dashboard/employees', icon: Briefcase },
        { label: 'Role & Izin', path: '/dashboard/roles', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 overflow-y-auto hidden md:block z-10">
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6" />
                    SIS Sekolah
                </h1>
            </div>

            <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                `}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;