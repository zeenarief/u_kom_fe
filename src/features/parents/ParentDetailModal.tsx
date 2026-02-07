import { Edit, User, MapPin, Briefcase, Phone, ShieldCheck, Unlink } from 'lucide-react';
import { formatDate } from '../../lib/date';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useParentDetail, useUnlinkParentFromUser } from './parentQueries';
import { useAlertStore } from '../../store/alertStore';
import type { Parent } from './types';
import ParentUserLinker from './ParentUserLinker';

interface ParentDetailModalProps {
    parentId: string | null;
    onClose: () => void;
    onEdit: (parent: Parent) => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function ParentDetailModal({ parentId, onClose, onEdit }: ParentDetailModalProps) {
    const { data: parent, isLoading, isError } = useParentDetail(parentId);

    const unlinkMutation = useUnlinkParentFromUser();
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

    if (isLoading && parentId) {
        return (
            <Modal isOpen={!!parentId} onClose={onClose} title="Loading...">
                <div className="p-8 text-center">Mengambil data...</div>
            </Modal>
        );
    }

    if (isError || !parent) return null;

    return (
        <Modal isOpen={!!parentId} onClose={onClose} title="Detail Orang Tua">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

                {/* Header */}
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
                        <DetailRow label="Gender" value={parent.gender === 'male' ? 'Laki-laki' : 'Perempuan'} />
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

                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" onClick={onClose}>Tutup</Button>
                    <Button onClick={() => onEdit(parent)}>
                        <Edit size={16} className="mr-2" />
                        Edit Data
                    </Button>
                </div>

            </div>
        </Modal>
    );
}