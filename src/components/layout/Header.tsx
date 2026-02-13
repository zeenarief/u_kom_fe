import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, ChevronDown, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // State for active dropdown
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        toast.success('Anda telah keluar.');
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Check if click is outside nav AND outside user menu AND outside mobile menu
            const outsideNav = navRef.current && !navRef.current.contains(target);
            const outsideUserMenu = userMenuRef.current && !userMenuRef.current.contains(target);
            const outsideMobileMenu = mobileMenuRef.current && !mobileMenuRef.current.contains(target);

            if (outsideNav && outsideUserMenu && outsideMobileMenu) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown and mobile menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
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

    // --- Dynamic Nav Menu ---
    const getNavGroups = () => {
        // 1. Menu untuk SISWA
        if (user?.profile_context?.type === 'student') {
            return [
                {
                    name: 'Menu Siswa',
                    items: [
                        { label: 'Jadwal Pelajaran', path: '/dashboard/schedules' },
                        { label: 'Tugas & PR', path: '/dashboard/assignments' },
                        { label: 'Nilai Akademik', path: '/dashboard/grades' }, // Placeholder
                    ]
                }
            ];
        }

        // 2. Menu untuk ADMIN (Default)
        // Jika roles mengandung admin, tampilkan semua
        if (user?.roles?.includes('admin')) {
            return [
                {
                    name: 'Akademik',
                    items: [
                        { label: 'Tahun Ajaran', path: '/dashboard/academic-years' },
                        { label: 'Data Kelas', path: '/dashboard/classrooms' },
                        { label: 'Mata Pelajaran', path: '/dashboard/subjects' },
                        { label: 'Guru Pengampu', path: '/dashboard/assignments' },
                        { label: 'Jadwal Pelajaran', path: '/dashboard/schedules' },
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
                    items: [
                        { label: 'Guru & Tendik', path: '/dashboard/employees' },
                        { label: 'Manajemen User', path: '/dashboard/users' },
                        { label: 'Role & Izin', path: '/dashboard/roles' },
                    ]
                }
            ];
        }

        return [];
    };

    const navGroups = getNavGroups();

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50 shadow-sm">
            <div className="px-4 md:px-6 h-full flex items-center justify-between">
                {/* Logo area */}
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6" />
                        <span>SIS Sekolah</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {navGroups.length > 0 && (
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
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    {/* User Menu (Desktop) */}
                    <div className="relative hidden md:block" ref={userMenuRef}>
                        <button
                            onClick={() => toggleDropdown('user-menu')}
                            className={`flex items-center gap-2 text-right p-1 rounded-md transition-colors ${activeDropdown === 'user-menu' ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.roles?.[0] || 'User'}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <UserIcon size={16} />
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-200 text-gray-400 ${activeDropdown === 'user-menu' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'user-menu' && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <Link
                                    to="/dashboard/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <UserIcon size={16} />
                                    Profil Saya
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <LogOut size={16} />
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="md:hidden border-t border-gray-100 bg-white absolute top-16 left-0 right-0 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto z-40 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-4">
                        {/* User Profile Summary in Mobile Menu */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <UserIcon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.roles?.[0] || 'User'}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        {navGroups.length > 0 && (
                            <div className="space-y-1">
                                <Link
                                    to="/dashboard"
                                    className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Dashboard
                                </Link>

                                {navGroups.map((group) => {
                                    const isExpanded = activeDropdown === group.name;

                                    return (
                                        <div key={group.name} className="space-y-1">
                                            <button
                                                onClick={() => toggleDropdown(group.name)}
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                                            >
                                                {group.name}
                                                <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isExpanded && (
                                                <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-3">
                                                    {group.items.map((item) => (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            className={`block px-3 py-2 rounded-md text-sm ${isActive(item.path)
                                                                ? 'text-blue-700 font-medium'
                                                                : 'text-gray-600 hover:text-gray-900'
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
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <Link
                                to="/dashboard/profile"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                                <UserIcon size={16} />
                                Profil Saya
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                            >
                                <LogOut size={16} />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;