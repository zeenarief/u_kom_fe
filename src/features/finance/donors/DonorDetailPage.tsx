import { useParams, useNavigate } from 'react-router-dom';
import { useDonor } from '../donationQueries';
import { Loader2, ArrowLeft, Phone, Mail, MapPin, Wallet } from 'lucide-react';
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

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Detail Donatur</h1>
            </div>

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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Riwayat Donasi</h3>
                    {/* Add logic to filter donations by this donor if API supports it */}
                </div>
                <p className="text-gray-500 italic text-sm">
                    Fitur riwayat donasi per donatur akan segera hadir.
                </p>
            </div>
        </div>
    );
};

export default DonorDetailPage;
