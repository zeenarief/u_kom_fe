import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { ShieldAlert, History, ClipboardList } from 'lucide-react';

const MusyrifDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ahlan wa Sahlan, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Dashboard Musyrif untuk memantau kedisiplinan santri.
                        </p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium border border-emerald-100 flex items-center gap-2">
                        <ShieldAlert size={18} />
                        Status: Musyrif Aktif
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pelanggaran Santri (Ex Riwayat) */}
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate('/dashboard/violations/history')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                            <History size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Pelanggaran Santri</h3>
                            <p className="text-xs text-gray-500">Lihat riwayat & catat pelanggaran baru</p>
                        </div>
                    </div>
                </div>

                {/* Tata Tertib (Ex Data Pelanggaran) */}
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate('/dashboard/violations/master')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Tata Tertib</h3>
                            <p className="text-xs text-gray-500">Kelola kategori & jenis pelanggaran</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusyrifDashboard;
