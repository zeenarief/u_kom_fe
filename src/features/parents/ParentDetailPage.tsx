import { useNavigate, useParams } from 'react-router-dom';
import { Edit, User, MapPin, Briefcase, Phone, ShieldCheck, Unlink, Trash2, Users } from 'lucide-react';
import { formatDate } from '../../lib/date';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useParentDetail, useUnlinkParentFromUser, useDeleteParent } from './parentQueries';
import { useAlertStore } from '../../store/alertStore';
import ParentUserLinker from './ParentUserLinker';

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function ParentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: parent, isLoading, isError } = useParentDetail(id || null);

    const unlinkMutation = useUnlinkParentFromUser();
    const deleteMutation = useDeleteParent();
    const { showAlert } = useAlertStore();

    const handleUnlink = () => {
        if (!parent) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Putuskan akun ${parent.user?.username}?`,
            'warning',
            () => unlinkMutation.mutate(parent.id),
            () => { }
        );
    };

    const handleEdit = () => {
        navigate(`/dashboard/parents/${id}/edit`);
    };

    const handleDelete = () => {
        if (!id) return;
        showAlert(
            'Konfirmasi Hapus',
            'Yakin hapus data orang tua ini?',
            'warning',
            () => deleteMutation.mutate(id, {
                onSuccess: () => {
                    navigate('/dashboard/parents');
                }
            }),
            () => { }
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data orang tua...</p>
                </div>
            </div>
        );
    }

    if (isError || !parent) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-red-500">Data orang tua tidak ditemukan.</p>
                    <Button onClick={() => navigate('/dashboard/parents')} className="mt-4">
                        Kembali ke Daftar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Breadcrumb */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <Breadcrumb
                        items={[
                            { label: 'Orang Tua', href: '/dashboard/parents', icon: Users },
                            { label: parent.full_name }
                        ]}
                    />
                </div>

                <div className="p-6 space-y-6">
                    {/* Header Card */}
                    <div className="bg-purple-50 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-2xl">
                            {parent.full_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{parent.full_name}</h2>
                            <div className="flex gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded ${parent.life_status === 'alive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {parent.life_status === 'alive' ? 'Hidup' : 'Meninggal'}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                                    {parent.marital_status || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                            <Phone size={18} className="text-purple-500" /> Kontak
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                            <DetailRow label="No. Handphone" value={parent.phone_number} />
                            <DetailRow label="Email" value={parent.email} />
                        </div>
                    </div>

                    {/* Pekerjaan */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                            <Briefcase size={18} className="text-purple-500" /> Pekerjaan & Pendidikan
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow label="Pekerjaan" value={parent.occupation} />
                            <DetailRow label="Penghasilan" value={parent.income_range} />
                            <DetailRow label="Pendidikan Terakhir" value={parent.education_level} />
                        </div>
                    </div>

                    {/* Data Pribadi */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                            <User size={18} className="text-purple-500" /> Data Pribadi
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow label="NIK" value={parent.nik} />
                            <DetailRow label="Gender" value={parent.gender === 'male' ? 'Laki-laki' : parent.gender === 'female' ? 'Perempuan' : '-'} />
                            <DetailRow label="Tempat Lahir" value={parent.place_of_birth} />
                            <DetailRow label="Tanggal Lahir" value={formatDate(parent.date_of_birth)} />
                        </div>
                    </div>

                    {/* Alamat */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                            <MapPin size={18} className="text-purple-500" /> Alamat
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                            <p>{parent.address}</p>
                            <p>RT {parent.rt} / RW {parent.rw}</p>
                            <p>{parent.sub_district}, {parent.district}</p>
                            <p>{parent.city}, {parent.province} {parent.postal_code}</p>
                        </div>
                    </div>

                    {/* Akun Sistem */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                            <ShieldCheck size={18} className="text-purple-500" /> Akun Sistem
                        </h3>

                        {parent.user ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                        {parent.user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-green-900">Terhubung</p>
                                        <p className="text-sm text-green-700">User: <span className="font-mono">{parent.user.username}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUnlink}
                                    disabled={unlinkMutation.isPending}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                                    title="Putuskan Hubungan"
                                >
                                    <Unlink size={18} />
                                </button>
                            </div>
                        ) : (
                            <ParentUserLinker parentId={parent.id} />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-between gap-3 border-t">
                        <Button variant="ghost" onClick={() => navigate('/dashboard/parents')}>
                            Kembali
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Hapus
                            </Button>
                            <Button onClick={handleEdit}>
                                <Edit size={16} className="mr-2" />
                                Edit Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
