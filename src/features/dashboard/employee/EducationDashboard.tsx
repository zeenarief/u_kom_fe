
import { useAuthStore } from '../../../store/authStore';
import {
    GraduationCap,
    Book,
    Users,
    ClipboardList,
    School
} from 'lucide-react';

const EducationDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Pendidikan. Cek jadwal dan kurikulum terbaru.
                        </p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium border border-indigo-100 flex items-center gap-2">
                        <School size={18} />
                        Status: Admin Pendidikan
                    </div>
                </div>
            </div>

            {/* Education Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Siswa Aktif</p>
                            <h3 className="text-2xl font-bold text-gray-900">450</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kelas Perwalian</p>
                            <h3 className="text-2xl font-bold text-gray-900">12 Rombel</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Book size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mata Pelajaran</p>
                            <h3 className="text-2xl font-bold text-gray-900">18 Mapel</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Menu Admin Pendidikan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <ClipboardList size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Data Siswa</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <Book size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Kurikulum</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Data Guru</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <School size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Data Kelas</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EducationDashboard;
