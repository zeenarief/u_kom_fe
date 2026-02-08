import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, MapPin, ShieldCheck, Printer,
    ArrowLeft, Users, GraduationCap, School, Edit
} from 'lucide-react';
import { formatDate } from '../../lib/date';
import Button from '../../components/ui/Button';
import { useStudentDetail, useExportStudentBiodata, useUnlinkStudentFromUser } from './studentQueries';
import { useAlertStore } from '../../store/alertStore';
import UserLinker from "./UserLinker";
import FamilyManager from './FamilyManager';
import GuardianManager from './GuardianManager';
import type { Student } from './types';

// --- Sub-components for Tab Content ---

const OverviewTab = ({ student }: { student: Student }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b">
                <User size={18} className="text-blue-500" /> Identitas Pribadi
            </h3>
            <div className="space-y-4">
                <DetailItem label="Nama Lengkap" value={student.full_name} />
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="NIK" value={student.nik} />
                    <DetailItem label="No. KK" value={student.no_kk} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Jenis Kelamin" value={student.gender === 'male' ? 'Laki-laki' : 'Perempuan'} />
                    <DetailItem
                        label="Tempat, Tanggal Lahir"
                        value={`${student.place_of_birth || ''}, ${formatDate(student.date_of_birth)}`}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Email" value={student.email} />
                </div>
            </div>
        </div>

        {/* Address Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b">
                <MapPin size={18} className="text-blue-500" /> Alamat Domisili
            </h3>
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">{student.address}</p>
                    <p className="text-sm text-gray-600">
                        RT {student.rt} / RW {student.rw}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Kel. {student.sub_district}, Kec. {student.district}
                    </p>
                    <p className="text-sm text-gray-600">
                        {student.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Prov. {student.province} - {student.postal_code}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const AcademicTab = ({ student }: { student: Student }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b">
            <School size={18} className="text-blue-500" /> Data Akademik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="NISN" value={student.nisn} />
            <DetailItem label="NIM / No. Induk" value={student.nim} />
            <DetailItem label="Kelas Saat Ini" value={student.class_name} />
            <DetailItem label="Jurusan" value={student.major} />
            <DetailItem label="Tingkat" value={student.level} />
            <DetailItem label="Status Siswa" value={student.status} />
        </div>
    </div>
);

const AccountTab = ({ student, unlinkMutation, handleUnlink }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 pb-2 border-b">
            <ShieldCheck size={18} className="text-blue-500" /> Akun Sistem
        </h3>

        {student.user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                        {student.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-green-900">Terhubung ke Akun</p>
                        <p className="text-sm text-green-700 mt-0.5">Username: <span className="font-mono font-medium">{student.user.username}</span></p>
                        <p className="text-xs text-green-600 mt-0.5">{student.user.email}</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={handleUnlink}
                    isLoading={unlinkMutation.isPending}
                    className="text-red-500 hover:bg-red-100 hover:text-red-700 hover:border-red-200 w-full sm:w-auto"
                >
                    Putuskan Hubungan
                </Button>
            </div>
        ) : (
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Siswa ini belum terhubung dengan akun user manapun. Hubungkan akun agar siswa dapat login ke sistem.
                </p>
                <UserLinker studentId={student.id} />
            </div>
        )}
    </div>
);

// Helper Component
const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div>
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium break-words">{value || '-'}</span>
    </div>
);


export default function StudentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'family' | 'academic' | 'account'>('overview');

    const { data: student, isLoading, isError } = useStudentDetail(id || null);
    const exportBiodataMutation = useExportStudentBiodata();
    const unlinkMutation = useUnlinkStudentFromUser();
    const { showAlert } = useAlertStore();

    const handlePrintBiodata = () => {
        if (id && student) {
            exportBiodataMutation.mutate({
                id: id,
                name: student.full_name
            });
        }
    };

    const handleUnlink = () => {
        if (!student) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Yakin ingin memutuskan hubungan akun ${student.user?.username}? Siswa ini tidak akan bisa login lagi.`,
            'warning',
            () => unlinkMutation.mutate(student.id),
            () => { }
        );
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat data siswa...</div>;
    if (isError || !student) return <div className="p-8 text-center text-red-500">Gagal memuat data siswa.</div>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Akademik', icon: School },
        { id: 'family', label: 'Keluarga', icon: Users },
        { id: 'account', label: 'Akun', icon: ShieldCheck },
    ] as const;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Navigation Header */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 mb-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate('/dashboard/students')}
                        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Kembali ke Daftar Siswa
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl border-4 border-white shadow-sm">
                                {student.full_name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{student.full_name}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                                        {student.status || 'Active'}
                                    </span>
                                    {student.major && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium flex items-center gap-1">
                                            <GraduationCap size={12} /> {student.major}
                                        </span>
                                    )}
                                    {student.class_name && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                            Kelas {student.class_name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 self-start md:self-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/dashboard/students/${id}/edit`)}
                                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                <Edit size={16} className="mr-2" /> Edit Data
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePrintBiodata}
                                isLoading={exportBiodataMutation.isPending}
                                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <Printer size={16} className="mr-2" /> Cetak Biodata
                            </Button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-1 mt-8 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                                        ${isActive
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                                        }
                                    `}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {activeTab === 'overview' && <OverviewTab student={student} />}

                {activeTab === 'academic' && <AcademicTab student={student} />}

                {activeTab === 'family' && (
                    <div className="space-y-6">
                        <FamilyManager student={student} />
                        <GuardianManager student={student} />
                    </div>
                )}

                {activeTab === 'account' && (
                    <AccountTab
                        student={student}
                        unlinkMutation={unlinkMutation}
                        handleUnlink={handleUnlink}
                    />
                )}
            </div>

            {/* Edit Modal - Removed, using dedicated page */}
        </div>
    );
}
