import { useParams, useNavigate } from 'react-router-dom';
import { useDonation } from '../donationQueries';
import { Loader2, Calendar, User, Phone, MapPin, ArrowLeft, Wallet, Package, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Breadcrumb from '../../../components/common/Breadcrumb';

const DonationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: donation, isLoading, isError } = useDonation(id || '');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (isError || !donation) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Donasi tidak ditemukan</h3>
                <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
                    Kembali
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Fundraising', href: '/dashboard', icon: Wallet },
                    { label: 'Riwayat Donasi', href: '/dashboard/finance/donations/history' },
                    { label: 'Detail Donasi' }
                ]}
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Detail Donasi</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    {donation.type === 'MONEY' ? <Wallet className="text-emerald-500" /> : <Package className="text-blue-500" />}
                                    Donasi {donation.type === 'MONEY' ? 'Uang' : 'Barang'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    ID: {donation.id}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.type === 'MONEY' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {donation.payment_method}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-500">Tanggal Donasi</label>
                                <div className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                                    <Calendar size={16} className="text-gray-400" />
                                    {new Date(donation.date).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">
                                    {donation.type === 'MONEY' ? 'Total Donasi' : 'Jumlah Item'}
                                </label>
                                <div className="text-2xl font-bold text-gray-900 mt-1">
                                    {donation.type === 'MONEY'
                                        ? `Rp ${donation.total_amount?.toLocaleString('id-ID')}`
                                        : `${donation.items?.length || 0} Item`
                                    }
                                </div>
                            </div>
                        </div>

                        {donation.description && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-sm text-gray-500 mb-2 block">Catatan / Doa</label>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg italic">
                                    "{donation.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Items List for GOODS */}
                    {donation.type === 'GOODS' && donation.items && donation.items.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package size={18} /> Daftar Barang
                            </h3>
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Nama Barang</th>
                                            <th className="px-4 py-3 text-right">Jumlah</th>
                                            <th className="px-4 py-3 text-right">Satuan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {donation.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{item.item_name}</td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">{item.unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Donor Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                            <User size={18} /> Informasi Donatur
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Nama Donatur</label>
                                <div className="font-medium text-gray-900">{donation.donor.name}</div>
                            </div>
                            {donation.donor.phone && (
                                <div>
                                    <label className="text-xs text-gray-500">Nomor Telepon</label>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone size={14} className="text-gray-400" />
                                        {donation.donor.phone}
                                    </div>
                                </div>
                            )}
                            {donation.donor.address && (
                                <div>
                                    <label className="text-xs text-gray-500">Alamat</label>
                                    <div className="flex items-start gap-2 text-sm text-gray-700">
                                        <MapPin size={14} className="text-gray-400 mt-1" />
                                        {donation.donor.address}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Proof File */}
                    {donation.proof_file && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                                <FileText size={18} /> Bukti Transfer
                            </h3>
                            <a
                                href={donation.proof_file} // Adjust according to how file URLs are served
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                                <div className="p-2 bg-white rounded border border-gray-200 group-hover:border-emerald-200">
                                    <FileText size={20} className="text-emerald-600" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">Lihat Bukti</p>
                                    <p className="text-xs text-gray-500">Klik untuk membuka</p>
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationDetailPage;
