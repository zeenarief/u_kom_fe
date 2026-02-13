
import { useAuthStore } from '../../../store/authStore';
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    FileText,
    PieChart
} from 'lucide-react';

const FinanceDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Keuangan. Laporan bulan ini sudah tersedia.
                        </p>
                    </div>
                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium border border-green-100 flex items-center gap-2">
                        <DollarSign size={18} />
                        Status: Admin Keuangan
                    </div>
                </div>
            </div>

            {/* Finance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pemasukan Bulan Ini</p>
                            <h3 className="text-2xl font-bold text-gray-900">Rp 150 Jt</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tunggakan SPP</p>
                            <h3 className="text-2xl font-bold text-gray-900">Rp 25 Jt</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Realisasi Anggaran</p>
                            <h3 className="text-2xl font-bold text-gray-900">60%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Menu Admin Keuangan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Input Pembayaran</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Laporan Keuangan</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Rekap SPP</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                            <PieChart size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">RAPBS</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
