import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Leaf, History, Users, PlusCircle } from 'lucide-react';

const FundraiserDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Selamat Bertugas, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Dashboard Fundraising untuk mengelola donasi dan data donatur.
                        </p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium border border-emerald-100 flex items-center gap-2">
                        <Leaf size={18} />
                        Status: Fundraiser Aktif
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Catat Donasi */}
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate('/dashboard/finance/donations/create')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                            <PlusCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Catat Donasi</h3>
                            <p className="text-xs text-gray-500">Input donasi baru (Uang/Barang)</p>
                        </div>
                    </div>
                </div>

                {/* Riwayat Donasi */}
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate('/dashboard/finance/donations/history')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                            <History size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Riwayat Donasi</h3>
                            <p className="text-xs text-gray-500">Lihat semua data donasi masuk</p>
                        </div>
                    </div>
                </div>

                {/* Data Donatur */}
                <div
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group"
                    onClick={() => navigate('/dashboard/finance/donors')}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Data Donatur</h3>
                            <p className="text-xs text-gray-500">Kelola database donatur</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundraiserDashboard;
