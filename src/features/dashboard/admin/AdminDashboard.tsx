import {
    Users,
    GraduationCap,
    Briefcase,
    UserSquare2,
    ArrowUpRight,
    BarChart3
} from 'lucide-react';
import { useDashboardStats } from '../dashboardQueries';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";
import { StatCard } from '../components/StatCard';

export default function AdminDashboard() {
    const { data: stats, isLoading, isError } = useDashboardStats();
    const navigate = useNavigate();

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat statistik dashboard...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;
    if (!stats) return null;

    // Data untuk Grafik Pie
    const genderData = [
        { name: 'Laki-laki', value: stats.student_gender.male },
        { name: 'Perempuan', value: stats.student_gender.female },
    ];
    const COLORS = ['#3B82F6', '#EC4899']; // Biru & Pink

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Selamat datang kembali di sistem informasi sekolah.</p>
                </div>
                <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center gap-2">
                    <BarChart3 size={16} /> Data Realtime
                </div>
            </div>

            {/* --- 1. STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Siswa"
                    value={stats.total_students}
                    icon={GraduationCap}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-100"
                />
                <StatCard
                    title="Total Guru & Tendik"
                    value={stats.total_employees}
                    icon={Briefcase}
                    colorClass="text-teal-600"
                    bgClass="bg-teal-100"
                />
                <StatCard
                    title="Total Orang Tua"
                    value={stats.total_parents}
                    icon={UserSquare2}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-100"
                />
                <StatCard
                    title="User Aktif"
                    value={stats.total_users}
                    icon={Users}
                    colorClass="text-orange-600"
                    bgClass="bg-orange-100"
                />
            </div>

            {/* --- 2. GRAFIK & WIDGET --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Grafik Gender Siswa */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
                    <h3 className="font-bold text-gray-800 mb-4">Komposisi Siswa</h3>
                    <div className="h-64 w-full">
                        {stats.total_students > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="50%"
                                        outerRadius="70%"
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {/* 4. Gunakan Underscore (_) untuk variabel yang tidak dipakai */}
                                        {genderData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data siswa</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Shortcut */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* TOMBOL 1: Tambah Siswa */}
                        <div
                            onClick={() => navigate('/dashboard/students')} // <--- 3. TAMBAHKAN ONCLICK
                            className="p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition"><GraduationCap size={20} /></div>
                                <ArrowUpRight size={16} className="text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <h4 className="font-bold text-gray-800 mt-3">Data Siswa</h4>
                            <p className="text-xs text-gray-500 mt-1">Lihat dan kelola data siswa.</p>
                        </div>

                        {/* TOMBOL 2: Tambah Guru */}
                        <div
                            onClick={() => navigate('/dashboard/employees')} // <--- 3. TAMBAHKAN ONCLICK
                            className="p-4 border rounded-lg hover:border-teal-400 hover:bg-teal-50 transition cursor-pointer group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-white group-hover:shadow-sm transition"><Briefcase size={20} /></div>
                                <ArrowUpRight size={16} className="text-gray-400 group-hover:text-teal-500" />
                            </div>
                            <h4 className="font-bold text-gray-800 mt-3">Data Guru</h4>
                            <p className="text-xs text-gray-500 mt-1">Lihat dan kelola data kepegawaian.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
