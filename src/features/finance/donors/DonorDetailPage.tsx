import { useParams, useNavigate } from 'react-router-dom';
import { useDonor } from '../donationQueries';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Wallet, Package } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Breadcrumb from '../../../components/common/Breadcrumb';

const DonorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: donor, isLoading, isError } = useDonor(id || '');

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (isError || !donor) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Donatur tidak ditemukan</h3>
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
                    { label: 'Data Donatur', href: '/dashboard/finance/donors' },
                    { label: 'Detail Donatur' }
                ]}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold">
                                {donor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{donor.name}</h1>
                                <p className="text-gray-500 text-sm">Terdaftar sejak {new Date(donor.created_at || Date.now()).toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                        {/* Actions could go here */}
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Phone size={12} /> Kontak
                        </label>
                        <p className="text-gray-900 font-medium">{donor.phone || '-'}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <Mail size={12} /> Email
                        </label>
                        <p className="text-gray-900 font-medium">{donor.email || '-'}</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={12} /> Alamat
                        </label>
                        <p className="text-gray-900 font-medium">{donor.address || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Donation History for this Donor (Placeholder/Future Feature) */}
            {/* Donation History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 text-lg">Riwayat 5 Donasi Terakhir</h3>
                    {/* Future: Link to full history */}
                </div>

                {!donor.recent_donations || donor.recent_donations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Belum ada riwayat donasi.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {donor.recent_donations.map((donation) => (
                            <div key={donation.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/dashboard/finance/donations/${donation.id}`)}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${donation.type === 'MONEY'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {donation.type === 'MONEY' ? <Wallet size={18} /> : <Package size={18} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${donation.type === 'MONEY'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-blue-50 text-blue-700 border border-blue-100'
                                                }`}>
                                                {donation.type === 'MONEY' ? 'Uang' : 'Barang'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(donation.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="font-medium text-gray-900 mt-1">
                                            {donation.type === 'MONEY' ? (
                                                <span>Rp {donation.total_amount?.toLocaleString('id-ID')}</span>
                                            ) : (
                                                <span>{donation.items?.length || 0} Item Barang</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-400 group-hover:text-gray-600">
                                    <ArrowLeft size={16} className="rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDetailPage;
