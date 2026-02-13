import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { BookOpen, Calendar, Clock, GraduationCap } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Siswa. Semangat belajar hari ini!
                        </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center gap-2">
                        <GraduationCap size={18} />
                        Status: Siswa Aktif
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Jadwal Pelajaran */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/dashboard/schedules')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Jadwal Pelajaran</h3>
                            <p className="text-xs text-gray-500">Lihat jadwal kelas Anda</p>
                        </div>
                    </div>
                </div>

                {/* Tugas & PR */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group" onClick={() => navigate('/dashboard/assignments')}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Tugas & PR</h3>
                            <p className="text-xs text-gray-500">Cek tugas yang belum selesai</p>
                        </div>
                    </div>
                </div>

                {/* Riwayat Absensi (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Riwayat Absensi</h3>
                            <p className="text-xs text-gray-500">Rekap kehadiran Anda</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pengumuman Terbaru (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Pengumuman Terbaru</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-600 italic">Belum ada pengumuman terbaru.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
