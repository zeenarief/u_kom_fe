import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, MapPin, ShieldCheck, Printer,
    ArrowLeft, Users, GraduationCap, School, Edit,
    Mail, Phone, Calendar, BookOpen, Home, Heart, FileText,
    CheckCircle, XCircle, AlertCircle, Download,
    type LucideIcon
} from 'lucide-react';
import { formatDate, calculateAge } from '../../lib/date';
import Button from '../../components/ui/Button';
import { useStudentDetail, useExportStudentBiodata, useUnlinkStudentFromUser, usePrintStudentBiodata } from './studentQueries';
import { useAlertStore } from '../../store/alertStore';
import UserLinker from "./UserLinker";
import FamilyManager from './FamilyManager';
import GuardianManager from './GuardianManager';
import type { Student } from './types';
import Badge from '../../components/ui/Badge';

// Helper untuk status badge
const getStatusConfig = (status?: string) => {
    switch (status) {
        case 'ACTIVE':
            return { color: 'green', icon: CheckCircle, label: 'Aktif' };
        case 'GRADUATED':
            return { color: 'blue', icon: CheckCircle, label: 'Lulus' };
        case 'DROPOUT':
            return { color: 'red', icon: XCircle, label: 'Dropout' };
        case 'INACTIVE':
            return { color: 'gray', icon: AlertCircle, label: 'Non-Aktif' };
        default:
            return { color: 'gray', icon: AlertCircle, label: 'Tidak Diketahui' };
    }
};

// --- Sub-components for Tab Content ---

const PersonalInfoCard = ({ student }: { student: Student }) => {
    const age = student.date_of_birth ? calculateAge(student.date_of_birth) : null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Identitas Pribadi</h3>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <DetailItem
                            label="Nama Lengkap"
                            value={student.full_name}
                            important
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="Jenis Kelamin"
                                value={student.gender === 'male' ? 'Laki-laki' : student.gender === 'female' ? 'Perempuan' : student.gender || '-'}
                                icon={Heart}
                            />
                            <DetailItem
                                label="Usia"
                                value={age ? `${age} tahun` : '-'}
                            />
                        </div>
                        <DetailItem
                            label="Tempat, Tanggal Lahir"
                            value={`${student.place_of_birth || '-'}, ${formatDate(student.date_of_birth)}`}
                            icon={Calendar}
                        />
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="NIK"
                                value={student.nik}
                                icon={FileText}
                            />
                            <DetailItem
                                label="No. KK"
                                value={student.no_kk}
                                icon={FileText}
                            />
                        </div>
                        <DetailItem
                            label="Email"
                            value={student.email} // Fallback to user email if direct email is empty handled in logic? user email is in student.user
                            icon={Mail}
                            type="email"
                        />
                        <DetailItem
                            label="Telepon"
                            value={student.phone || '-'}
                            icon={Phone}
                            type="phone"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddressCard = ({ student }: { student: Student }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Alamat Domisili</h3>
            </div>
        </div>
        <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 space-y-3">
                <div className="flex items-start gap-3">
                    <Home size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                            {student.address || 'Alamat belum diisi'}
                        </p>
                        {(student.rt || student.rw) && (
                            <p className="text-xs text-gray-600 mt-1">
                                RT {student.rt || '00'} / RW {student.rw || '00'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-blue-100">
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Kelurahan</span>
                        <p className="text-sm text-gray-900">{student.sub_district || '-'}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Kecamatan</span>
                        <p className="text-sm text-gray-900">{student.district || '-'}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Kota/Kabupaten</span>
                        <p className="text-sm text-gray-900">{student.city || '-'}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Provinsi</span>
                        <p className="text-sm text-gray-900">{student.province || '-'}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">Kode Pos</span>
                        <p className="text-sm text-gray-900">{student.postal_code || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AcademicInfoCard = ({ student }: { student: Student }) => {
    const statusConfig = getStatusConfig(student.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2">
                    <School size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Data Akademik</h3>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="NISN"
                                value={student.nisn}
                                important
                            />
                            <DetailItem
                                label="NIM / No. Induk"
                                value={student.nim}
                                important
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="Kelas Saat Ini"
                                value={student.class_name || '-'}
                                icon={BookOpen}
                            />
                            <DetailItem
                                label="Jurusan"
                                value={student.major || '-'}
                                icon={GraduationCap}
                            />
                        </div>

                        <DetailItem
                            label="Tingkat"
                            value={student.level || '-'}
                        />
                    </div>

                    <div className="space-y-5">
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Status Akademik
                            </span>
                            <Badge
                                color={statusConfig.color}
                                className="inline-flex items-center gap-1.5"
                            >
                                <StatusIcon size={14} />
                                {statusConfig.label}
                            </Badge>
                        </div>

                        <DetailItem
                            label="Tahun Masuk"
                            value={student.entry_year || '-'}
                        />

                        <DetailItem
                            label="Tahun Lulus"
                            value={student.graduation_year || '-'}
                        />

                        {/* GPA removed from recent DTO but keeping if legacy */}
                        <DetailItem
                            label="IPK/Nilai Akhir"
                            value={student.gpa || '-'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountCard = ({ student, unlinkMutation, handleUnlink }: { student: Student, unlinkMutation: { isPending: boolean }, handleUnlink: () => void }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Akun Sistem</h3>
                </div>
            </div>
            <div className="p-6">
                {student.user ? (
                    <div className="max-w-2xl">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl border-4 border-white shadow-sm">
                                        {student.user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-green-900 flex items-center gap-2">
                                            Akun Terhubung
                                            <CheckCircle size={16} className="text-green-600" />
                                        </p>
                                        <p className="text-sm text-green-800 mt-1 font-medium">
                                            Username: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">{student.user.username}</span>
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Email: {student.user.email}
                                        </p>
                                        <p className="text-xs text-green-600 mt-2">
                                            Terakhir login: {student.user.last_login ? formatDate(student.user.last_login) : 'Belum pernah login'}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={handleUnlink}
                                    isLoading={unlinkMutation.isPending}
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 w-full sm:w-auto"
                                >
                                    Putuskan Akun
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Note:</span> Memutuskan akun akan menghapus akses login siswa ini ke sistem. Data pribadi siswa akan tetap tersimpan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Akun Belum Terhubung</p>
                                    <p className="text-sm text-amber-800 mt-0.5">
                                        Siswa ini belum memiliki akses login ke sistem. Hubungkan dengan akun user untuk mengaktifkan fitur online.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <UserLinker studentId={student.id} />
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Component
const DetailItem = ({
    label,
    value,
    icon: Icon,
    important = false,
    type = 'text'
}: {
    label: string;
    value?: string | number | null;
    icon?: LucideIcon;
    important?: boolean;
    type?: 'text' | 'email' | 'phone';
}) => {
    const formattedValue = (() => {
        if (!value || value === '-') return '-';

        switch (type) {
            case 'email':
                return (
                    <a
                        href={`mailto:${value}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {value}
                    </a>
                );
            case 'phone':
                return (
                    <a
                        href={`tel:${value}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {value}
                    </a>
                );
            default:
                return value;
        }
    })();

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={14} className="text-gray-400" />}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
            <span className={`block text-sm ${important ? 'font-semibold text-gray-900' : 'text-gray-800'} mt-1 break-words`}>
                {formattedValue}
            </span>
        </div>
    );
};

// Quick Stats Component
const StudentStats = ({ student }: { student: Student }) => {
    const stats = [
        {
            label: 'Status',
            value: getStatusConfig(student.status).label,
            color: getStatusConfig(student.status).color,
            icon: CheckCircle
        },
        {
            label: 'Akun',
            value: student.user ? 'Terhubung' : 'Belum',
            color: student.user ? 'green' : 'amber',
            icon: ShieldCheck
        },
        {
            label: 'Kelas',
            value: student.class_name || '-',
            color: 'blue',
            icon: School
        },
        {
            label: 'NISN',
            value: student.nisn || '-',
            color: 'purple',
            icon: FileText
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                                <p className={`text-lg font-bold text-gray-900 mt-1`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function StudentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'family' | 'academic' | 'account'>('overview');

    const { data: student, isLoading, isError } = useStudentDetail(id || null);
    const exportBiodataMutation = useExportStudentBiodata();
    const printMutation = usePrintStudentBiodata();
    const unlinkMutation = useUnlinkStudentFromUser();
    const { showAlert } = useAlertStore();

    // HANDLER: Download PDF
    const handleExportBiodata = () => {
        if (id && student) {
            exportBiodataMutation.mutate({
                id: id,
                name: student.full_name
            });
        }
    };

    // HANDLER: Print Preview (Buka PDF di tab baru)
    const handlePrintBiodata = () => {
        if (id && student) {
            printMutation.mutate({
                id: id,
                name: student.full_name
            });
        }
    };

    const handleUnlink = () => {
        if (!student) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Yakin ingin memutuskan hubungan akun "${student.user?.username}" dengan siswa "${student.full_name}"?`,
            'warning',
            () => unlinkMutation.mutate(student.id),
            () => { }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Memuat data siswa...</p>
                </div>
            </div>
        );
    }

    if (isError || !student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <XCircle size={64} className="mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-500 mb-6">Tidak dapat memuat data siswa. Silakan coba lagi.</p>
                    <Button onClick={() => navigate('/dashboard/students')}>
                        <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar Siswa
                    </Button>
                </div>
            </div>
        );
    }

    interface TabItem {
        id: 'overview' | 'family' | 'academic' | 'account';
        label: string;
        icon: LucideIcon;
        count?: number;
    }

    const tabs: TabItem[] = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Akademik', icon: School },
        { id: 'family', label: 'Keluarga', icon: Users },
        { id: 'account', label: 'Akun', icon: ShieldCheck },
    ];

    const statusConfig = getStatusConfig(student.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <button
                            onClick={() => navigate('/dashboard/students')}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium group"
                        >
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-0.5 transition-transform" />
                            Kembali ke Daftar Siswa
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Student Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-start gap-5">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-3xl border-4 border-white shadow-lg">
                                        {student.full_name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2">
                                        <Badge color={statusConfig.color}>
                                            {statusConfig.label}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{student.full_name}</h1>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {student.major && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                <GraduationCap size={14} />
                                                {student.major}
                                            </div>
                                        )}
                                        {student.class_name && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                                <BookOpen size={14} />
                                                Kelas {student.class_name}
                                            </div>
                                        )}
                                        {student.nisn && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium font-mono">
                                                {student.nisn}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                        {student.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} />
                                                {student.email}
                                            </div>
                                        )}
                                        {student.city && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} />
                                                {student.district}, {student.city}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:ml-auto flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/dashboard/students/${id}/edit`)}
                                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={16} className="mr-2" /> Edit Data
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleExportBiodata}
                                    isLoading={exportBiodataMutation.isPending}
                                    className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                                >
                                    <Download size={16} className="mr-2" /> Export Biodata
                                </Button>
                                <Button
                                    onClick={handlePrintBiodata}
                                    isLoading={printMutation.isPending}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Printer size={16} className="mr-2" /> Cetak
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <StudentStats student={student} />
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative
                                            ${isActive
                                                ? 'text-blue-600 bg-blue-50 rounded-lg'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg'
                                            }
                                        `}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                        {tab.count && (
                                            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PersonalInfoCard student={student} />
                            <AddressCard student={student} />
                        </div>
                    )}

                    {activeTab === 'academic' && (
                        <AcademicInfoCard student={student} />
                    )}

                    {activeTab === 'family' && (
                        <div className="space-y-6">
                            <FamilyManager student={student} />
                            <GuardianManager student={student} />
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <AccountCard
                            student={student}
                            unlinkMutation={unlinkMutation}
                            handleUnlink={handleUnlink}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}