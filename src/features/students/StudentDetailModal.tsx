import {Edit, User, MapPin, CreditCard, ShieldCheck, Unlink} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useStudentDetail, useUnlinkStudentFromUser } from './studentQueries';
import type {Student} from '../../types/api';
import UserLinker from "./UserLinker.tsx";

interface StudentDetailModalProps {
    studentId: string | null;
    onClose: () => void;
    onEdit: (student: Student) => void; // Callback saat user ingin mengedit
}

// Komponen kecil untuk menampilkan baris data agar rapi
const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

export default function StudentDetailModal({ studentId, onClose, onEdit }: StudentDetailModalProps) {
    const { data: student, isLoading, isError } = useStudentDetail(studentId);

    const unlinkMutation = useUnlinkStudentFromUser();

    const handleUnlink = () => {
        if (!student) return;
        if (confirm(`Yakin ingin memutuskan hubungan akun ${student.user?.username}? Siswa ini tidak akan bisa login lagi.`)) {
            unlinkMutation.mutate(student.id);
        }
    };

    // Jika Loading
    if (isLoading && studentId) {
        return (
            <Modal isOpen={!!studentId} onClose={onClose} title="Memuat Data...">
                <div className="p-8 text-center">Loading details...</div>
            </Modal>
        );
    }

    // Jika Error
    if (isError) {
        return (
            <Modal isOpen={!!studentId} onClose={onClose} title="Error">
                <div className="p-8 text-center text-red-500">Gagal mengambil data siswa.</div>
            </Modal>
        );
    }

    if (!student) return null;

    return (
        <Modal isOpen={!!studentId} onClose={onClose} title="Detail Siswa">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">

                {/* Header Profile Singkat */}
                <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl">
                        {student.full_name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{student.full_name}</h2>
                        <p className="text-sm text-blue-700 font-medium">{student.nisn ? `NISN: ${student.nisn}` : 'Belum ada NISN'}</p>
                    </div>
                </div>

                {/* Section Data Akademik */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <CreditCard size={18} className="text-blue-500"/> Data Akademik
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        <DetailRow label="NIM / No. Induk" value={student.nim} />
                        <DetailRow label="NISN" value={student.nisn} />
                    </div>
                </div>

                {/* Section Data Pribadi */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <User size={18} className="text-blue-500"/> Identitas Pribadi
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                        <DetailRow label="Nama Lengkap" value={student.full_name} />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow label="NIK" value={student.nik} />
                            <DetailRow label="No. KK" value={student.no_kk} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow label="Jenis Kelamin" value={student.gender === 'male' ? 'Laki-laki' : 'Perempuan'} />
                            <DetailRow
                                label="Tempat, Tanggal Lahir"
                                value={`${student.place_of_birth || ''}, ${student.date_of_birth ? student.date_of_birth.split('T')[0] : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Alamat */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <MapPin size={18} className="text-blue-500"/> Alamat Domisili
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-gray-900">{student.address}</p>
                        <p className="text-sm text-gray-600">
                            RT {student.rt} / RW {student.rw}, Kel. {student.sub_district}
                        </p>
                        <p className="text-sm text-gray-600">
                            Kec. {student.district}, {student.city}
                        </p>
                        <p className="text-sm text-gray-600">
                            Prov. {student.province} - {student.postal_code}
                        </p>
                    </div>
                </div>

                {/* Section Akun Login */}
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 pb-2 border-b">
                        <ShieldCheck size={18} className="text-blue-500"/> Akun Sistem
                    </h3>

                    {student.user ? (
                        // KONDISI 1: SUDAH TERHUBUNG KE USER
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">

                            {/* Info User (Kiri) */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                    {student.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">Terhubung ke Akun</p>
                                    <p className="text-sm text-green-700">Username: <span className="font-mono">{student.user.username}</span></p>
                                    <p className="text-xs text-green-600">{student.user.email}</p>
                                </div>
                            </div>

                            {/* Tombol Unlink (Kanan) */}
                            <button
                                onClick={handleUnlink}
                                disabled={unlinkMutation.isPending}
                                className="p-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                title="Putuskan Hubungan Akun"
                            >
                                {unlinkMutation.isPending ? (
                                    <span className="text-xs">Loading...</span>
                                ) : (
                                    <Unlink size={18} />
                                )}
                            </button>
                        </div>
                    ) : (
                        // KONDISI 2: BELUM TERHUBUNG
                        <UserLinker studentId={student.id} />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end gap-3 border-t">
                    <Button variant="ghost" onClick={onClose}>
                        Tutup
                    </Button>
                    <Button onClick={() => onEdit(student)}>
                        <Edit size={16} className="mr-2" />
                        Edit Data
                    </Button>
                </div>

            </div>
        </Modal>
    );
}