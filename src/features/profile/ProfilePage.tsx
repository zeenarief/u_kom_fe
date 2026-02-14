import { useProfile } from '../admin/users/userQueries';
import { User, Mail, Shield, Calendar, Key, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../lib/date';

const ProfilePage = () => {
    const { data: user, isLoading, error } = useProfile();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100 max-w-2xl mx-auto mt-8">
                <p className="font-medium">Gagal memuat data profil.</p>
                <p className="text-sm mt-1">Silakan coba muat ulang halaman atau login kembali.</p>
            </div>
        );
    }

    // Assign gradient based on role
    const getGradient = (roleName?: string) => {
        const role = roleName?.toLowerCase() || '';
        if (role.includes('admin')) return 'from-blue-600 to-indigo-700';
        if (role.includes('guru') || role.includes('teacher')) return 'from-emerald-500 to-teal-600';
        if (role.includes('siswa') || role.includes('student')) return 'from-orange-400 to-amber-500';
        return 'from-gray-700 to-gray-900';
    };

    const gradientClass = getGradient(user.roles?.[0]);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">

            {/* Header Banner Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                {/* Decorative Banner */}
                <div className={`h-32 sm:h-48 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-3xl"></div>
                    {/* Abstract circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 sm:-mt-16 gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User size={48} className="sm:w-16 sm:h-16" />
                                </div>
                            </div>
                            {/* Role Badge on Avatar */}
                            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 translate-x-1/4 translate-y-1/4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 border-white shadow-sm bg-white text-gray-800`}>
                                    {user.roles?.[0] || 'User'}
                                </span>
                            </div>
                        </div>

                        {/* Name & Basic Info */}
                        <div className="flex-1 space-y-1 pt-2 sm:pt-0 sm:pb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500 font-medium">@{user.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-500" />
                            Informasi Pribadi
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Mail size={16} />
                                    <span>Alamat Email</span>
                                </div>
                                <p className="text-gray-900 font-medium break-all">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Calendar size={16} />
                                    <span>Bergabung Sejak</span>
                                </div>
                                <p className="text-gray-900 font-medium">
                                    {user.created_at ? formatDate(user.created_at) : '-'}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Key size={16} />
                                    <span>User ID</span>
                                </div>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono break-all block w-full truncate">
                                    {user.id}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details (Placeholder for future) */}
                    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terakhir</h2>
                        <div className="text-gray-500 text-sm italic">Belum ada aktivitas yang tercatat.</div>
                    </div> */}
                </div>

                {/* Right Column: Roles & Permissions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-indigo-500" />
                            Peran & Akses
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Peran Saat Ini</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map((role) => (
                                        <div key={role} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                                            <Shield size={14} />
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {user.permissions && user.permissions.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-3">Daftar Izin ({user.permissions.length})</p>
                                    <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto space-y-2 border border-gray-100 custom-scrollbar">
                                        {user.permissions.map((perm) => (
                                            <div key={perm} className="flex items-start gap-2 text-xs text-gray-700">
                                                <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                                                <span className="font-mono">{perm}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
