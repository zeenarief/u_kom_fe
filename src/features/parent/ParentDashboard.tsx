import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    Users,
    Calendar,
    Clock,
    GraduationCap,
    Activity,
    FileText,
    CreditCard
} from 'lucide-react';

const ParentDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Dummy Data for Children
    const childrenData = [
        {
            id: '1',
            name: 'Budi Santoso',
            class: 'XII IPA 1',
            attendance: '95%',
            lastGrade: '88 (Mathematika)',
            status: 'Hadir',
            avatar: 'BS'
        },
        {
            id: '2',
            name: 'Siti Aminah',
            class: 'X IPS 2',
            attendance: '98%',
            lastGrade: '92 (Bahasa Inggris)',
            status: 'Hadir',
            avatar: 'SA'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Orang Tua / Wali. Pantau perkembangan putra-putri Anda di sini.
                        </p>
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium border border-purple-100 flex items-center gap-2">
                        <Users size={18} />
                        Status: Orang Tua / Wali
                    </div>
                </div>
            </div>

            {/* Children Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {childrenData.map((child) => (
                    <div key={child.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                {child.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{child.name}</h3>
                                <p className="text-sm text-gray-500">{child.class}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 flex items-center gap-2"><Clock size={16} /> Kehadiran</span>
                                <span className="font-medium text-green-600">{child.attendance}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 flex items-center gap-2"><Activity size={16} /> Nilai Terakhir</span>
                                <span className="font-medium text-gray-900">{child.lastGrade}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 flex items-center gap-2"><GraduationCap size={16} /> Status Hari Ini</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{child.status}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/dashboard/students/${child.id}`)} // Placeholder link
                            className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                        >
                            Lihat Detail
                        </button>
                    </div>
                ))}

                {/* Quick Actions Card */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl shadow-md text-white">
                    <h3 className="font-bold text-lg mb-4">Akses Cepat</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm">
                            <FileText size={20} />
                            <span className="font-medium">Lihat Raport</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm">
                            <CreditCard size={20} />
                            <span className="font-medium">Cek Tagihan SPP</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm">
                            <Calendar size={20} />
                            <span className="font-medium">Jadwal Pertemuan</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Notifications / Announcements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Pengumuman Sekolah</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-sm">Libur Nasional</h4>
                            <p className="text-sm text-blue-600 mt-1">Sekolah akan diliburkan pada tanggal 17 Agustus 2026 dalam rangka memperingati Hari Kemerdekaan.</p>
                            <p className="text-xs text-blue-400 mt-2">Posting: 12 Agt 2026</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 className="font-bold text-gray-800 text-sm">Rapat Orang Tua Murid</h4>
                            <p className="text-sm text-gray-600 mt-1">Diundang kepada seluruh orang tua untuk menghadiri rapat evaluasi semester ganjil.</p>
                            <p className="text-xs text-gray-400 mt-2">Posting: 10 Agt 2026</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Tagihan Belum Lunas</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg border-red-100 bg-red-50">
                            <div>
                                <h4 className="font-bold text-red-800">SPP Bulan Agustus</h4>
                                <p className="text-xs text-red-600">Jatuh tempo: 10 Agt 2026</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-red-800">Rp 500.000</p>
                                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded mt-1 hover:bg-red-700">Bayar</button>
                            </div>
                        </div>
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Tidak ada tagihan lainnya.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
