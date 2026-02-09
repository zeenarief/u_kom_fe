import { useNavigate, useParams } from 'react-router-dom';
import { Edit, User, MapPin, Phone, Users, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useGuardianDetail, useUnlinkGuardianFromUser, useLinkGuardianToUser } from './guardianQueries';
import { useAlertStore } from '../../store/alertStore';
import UserAccountSection from '../../components/common/UserAccountSection';

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function GuardianDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: guardian, isLoading, isError } = useGuardianDetail(id || null);
    const unlinkMutation = useUnlinkGuardianFromUser();
    const linkMutation = useLinkGuardianToUser();
    const { showAlert } = useAlertStore();

    const handleEdit = () => {
        navigate(`/dashboard/guardians/${id}/edit`);
    };

    const handleUnlink = () => {
        if (!guardian) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Yakin ingin memutuskan hubungan akun "${guardian.user?.username}" dengan wali "${guardian.full_name}"?`,
            'warning',
            () => unlinkMutation.mutate(guardian.id),
            () => { }
        );
    };

    const handleLink = (guardianId: string, userId: string) => {
        linkMutation.mutate({ guardianId, userId });
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data wali...</p>
                </div>
            </div>
        );
    }

    if (isError || !guardian) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-red-500">Data wali tidak ditemukan.</p>
                    <Button onClick={() => navigate('/dashboard/guardians')} className="mt-4">
                        Kembali ke Daftar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    {/* Breadcrumb */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Wali', href: '/dashboard/guardians', icon: Users },
                                { label: guardian.full_name }
                            ]}
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-3xl border-4 border-white shadow-lg">
                                        <Shield size={32} />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{guardian.full_name}</h1>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-medium uppercase">
                                            {guardian.relationship_to_student || 'Wali'}
                                        </span>
                                        {guardian.gender && (
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                {guardian.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:ml-auto flex flex-wrap gap-2">
                                {/* Edit Button */}
                                <Button
                                    onClick={handleEdit}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    <Edit size={16} className="mr-2" /> Edit Data
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 space-y-6">

                        {/* Kontak */}
                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                                <Phone size={18} className="text-orange-500" /> Kontak
                            </h3>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                                <DetailRow label="No. Handphone" value={guardian.phone_number} />
                                <DetailRow label="Email" value={guardian.email} />
                            </div>
                        </div>

                        {/* Data Pribadi */}
                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                                <User size={18} className="text-orange-500" /> Data Pribadi
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailRow label="NIK" value={guardian.nik} />
                                <DetailRow label="Gender" value={guardian.gender === 'male' ? 'Laki-laki' : guardian.gender === 'female' ? 'Perempuan' : '-'} />
                                <DetailRow label="Hubungan dengan Siswa" value={guardian.relationship_to_student} />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div>
                            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                                <MapPin size={18} className="text-orange-500" /> Alamat
                            </h3>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                <p>{guardian.address || '-'}</p>
                                {(guardian.rt || guardian.rw) && (
                                    <p>RT {guardian.rt || '-'} / RW {guardian.rw || '-'}</p>
                                )}
                                {guardian.sub_district && guardian.district && (
                                    <p>{guardian.sub_district}, {guardian.district}</p>
                                )}
                                {guardian.city && guardian.province && (
                                    <p>{guardian.city}, {guardian.province} {guardian.postal_code || ''}</p>
                                )}
                            </div>
                        </div>

                        {/* Akun Sistem */}
                        <UserAccountSection
                            user={guardian.user}
                            entityId={guardian.id}
                            entityType="guardian"
                            themeColor="orange"
                            onLink={handleLink}
                            onUnlink={handleUnlink}
                            linkLoading={linkMutation.isPending}
                            unlinkLoading={unlinkMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
