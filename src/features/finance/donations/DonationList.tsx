import { useState } from 'react';
import { useDonations } from '../donationQueries';
import { Calendar, Wallet, Package, Pencil } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useNavigate } from 'react-router-dom';

const DonationList = () => {
    const navigate = useNavigate();
    const [typeFilter, setTypeFilter] = useState('');
    const { data: donationsData, isLoading } = useDonations({ type: typeFilter });

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Fundraising', href: '/dashboard', icon: Wallet },
                    { label: 'Riwayat Donasi' }
                ]}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Donasi</h1>
                    <p className="text-gray-500 text-sm">Daftar semua donasi masuk</p>
                </div>

                <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-white"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">Semua Tipe</option>
                    <option value="MONEY">Uang (Money)</option>
                    <option value="GOODS">Barang (Goods)</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Donatur</th>
                            <th className="px-6 py-3">Tipe</th>
                            <th className="px-6 py-3">Metode</th>
                            <th className="px-6 py-3 text-right">Nominal / Barang</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8">Loading...</td>
                            </tr>
                        ) : donationsData?.items?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                    Belum ada data donasi
                                </td>
                            </tr>
                        ) : (
                            donationsData?.items?.map((donation: any) => (
                                <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
                                            onClick={() => navigate(`/dashboard/finance/donations/${donation.id}`)}
                                        >
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(donation.date).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {donation.donor?.name || 'Hamba Allah'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donation.type === 'MONEY' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {donation.type === 'MONEY' ? <Wallet size={12} className="mr-1" /> : <Package size={12} className="mr-1" />}
                                            {donation.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                            {donation.payment_method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold">
                                        {donation.type === 'MONEY'
                                            ? `Rp ${donation.total_amount?.toLocaleString('id-ID')}`
                                            : `${donation.items?.length || 0} Item`
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/dashboard/finance/donations/${donation.id}/edit`)}
                                            className="text-gray-400 hover:text-emerald-600 transition-colors"
                                            title="Edit Donasi"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DonationList;
