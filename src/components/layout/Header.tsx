import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // State for active dropdown
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        toast.success('Anda telah keluar.');
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setActiveDropdown(null);
    }, [location.pathname]);

    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    // Helper to check if a route is active (including sub-routes)
    const isActive = (path: string) => location.pathname === path;
    const isGroupActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

    const navGroups = [
        {
            name: 'Akademik',
            items: [
                { label: 'Tahun Ajaran', path: '/dashboard/academic-years' },
                { label: 'Data Kelas', path: '/dashboard/classrooms' },
                { label: 'Mata Pelajaran', path: '/dashboard/subjects' },
                { label: 'Jadwal Pelajaran', path: '/dashboard/schedules' },
                { label: 'Guru Pengampu', path: '/dashboard/assignments' },
            ]
        },
        {
            name: 'Kesiswaan',
            items: [
                { label: 'Data Siswa', path: '/dashboard/students' },
                { label: 'Data Orang Tua', path: '/dashboard/parents' },
                { label: 'Data Wali', path: '/dashboard/guardians' },
            ]
        },
        {
            name: 'Kepegawaian & User',
            items: [ // "Manajemen" renamed to be more descriptive based on content
                { label: 'Guru & Tendik', path: '/dashboard/employees' },
                { label: 'Manajemen User', path: '/dashboard/users' },
                { label: 'Role & Izin', path: '/dashboard/roles' },
            ]
        }
    ];

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-sm">
            {/* Logo area */}
            <div className="flex items-center gap-8">
                <Link to="/dashboard" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6" />
                    <span>SIS Sekolah</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2" ref={navRef}>
                    <Link
                        to="/dashboard"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        Dashboard
                    </Link>

                    {navGroups.map((group) => {
                        const groupActive = isGroupActive(group.items.map(i => i.path));

                        return (
                            <div key={group.name} className="relative">
                                <button
                                    onClick={() => toggleDropdown(group.name)}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${groupActive || activeDropdown === group.name
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {group.name}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === group.name ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === group.name && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`block px-4 py-2 text-sm ${isActive(item.path)
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Right: User Profile & Logout */}
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

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

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