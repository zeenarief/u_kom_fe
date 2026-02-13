
import { useAuthStore } from '../../../store/authStore';
import {
    Users,
    Calendar,
    BookOpen,
    FileText,
    CheckSquare
} from 'lucide-react';

const TeacherDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Guru. Jangan lupa input nilai sebelum tanggal 20.
                        </p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-medium border border-teal-100 flex items-center gap-2">
                        <Users size={18} />
                        Status: Guru / Pengajar
                    </div>
                </div>
            </div>

            {/* Teacher Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kelas Ajar</p>
                            <h3 className="text-2xl font-bold text-gray-900">4 Kelas</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Siswa</p>
                            <h3 className="text-2xl font-bold text-gray-900">120 Siswa</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tugas Dinilai</p>
                            <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Menu Cepat Guru</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Jadwal Mengajar</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Input Nilai</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Bank Soal</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Absensi Siswa</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
