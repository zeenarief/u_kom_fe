import { Edit, MapPin, Phone, ShieldCheck, Unlink } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useGuardianDetail, useUnlinkGuardianFromUser } from './guardianQueries';
import { useAlertStore } from '../../store/alertStore';
import type { Guardian } from './types';
import GuardianUserLinker from './GuardianUserLinker';

interface GuardianDetailModalProps {
    guardianId: string | null;
    onClose: () => void;
    onEdit: (guardian: Guardian) => void;
}

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function GuardianDetailModal({ guardianId, onClose, onEdit }: GuardianDetailModalProps) {
    const { data: guardian, isLoading, isError } = useGuardianDetail(guardianId);
    const unlinkMutation = useUnlinkGuardianFromUser();
    const { showAlert } = useAlertStore();

    const handleUnlink = () => {
        if (!guardian) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Putuskan akun ${guardian.user?.username}?`,
            'warning',
            () => unlinkMutation.mutate(guardian.id),
            () => { }
        );
    };

    if (isLoading && guardianId) {
        return (
            <Modal isOpen={!!guardianId} onClose={onClose} title="Loading...">
                <div className="p-8 text-center">Mengambil data wali...</div>
            </Modal>
        );
    }

    if (isError || !guardian) return null;

    return (
        <Modal isOpen={!!guardianId} onClose={onClose} title="Detail Wali">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

                {/* Header Profile */}
                <div className="bg-orange-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-2xl">
                        {guardian.full_name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{guardian.full_name}</h2>
                        <div className="flex gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase font-semibold">
                                {guardian.relationship_to_student || 'Wali'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                {guardian.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section Akun Sistem */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <ShieldCheck size={18} className="text-orange-500" /> Akun Sistem
                    </h3>

                    {guardian.user ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                    {guardian.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Terhubung</p>
                                    <p className="text-sm text-green-700">User: <span className="font-mono">{guardian.user.username}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={handleUnlink}
                                disabled={unlinkMutation.isPending}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                title="Putuskan Hubungan"
                            >
                                <Unlink size={18} />
                            </button>
                        </div>
                    ) : (
                        <GuardianUserLinker guardianId={guardian.id} />
                    )}
                </div>

                {/* Kontak */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <Phone size={18} className="text-orange-500" /> Kontak & Identitas
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        <DetailRow label="No. Handphone" value={guardian.phone_number} />
                        <DetailRow label="Email" value={guardian.email} />
                        <DetailRow label="NIK" value={guardian.nik} />
                        <DetailRow label="Hubungan" value={guardian.relationship_to_student} />
                    </div>
                </div>

                {/* Alamat */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <MapPin size={18} className="text-orange-500" /> Alamat Domisili
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                        <p className="font-medium">{guardian.address}</p>
                        <p>RT {guardian.rt} / RW {guardian.rw}</p>
                        <p>{guardian.sub_district}, {guardian.district}</p>
                        <p>{guardian.city}, {guardian.province} {guardian.postal_code}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" onClick={onClose}>Tutup</Button>
                    <Button onClick={() => onEdit(guardian)}>
                        <Edit size={16} className="mr-2" />
                        Edit Data
                    </Button>
                </div>

            </div>
        </Modal>
    );
}