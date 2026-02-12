import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, MapPin, ShieldCheck, Printer,
    ArrowLeft, Users, GraduationCap, School, Edit,
    BookOpen, Home, FileText,
    CheckCircle, XCircle, AlertCircle, Download,
    type LucideIcon
} from 'lucide-react';
import { formatDate, calculateAge } from '../../lib/date';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useStudentDetail, useExportStudentBiodata, useUnlinkStudentFromUser, usePrintStudentBiodata, useLinkStudentToUser } from './studentQueries';
import { useAlertStore } from '../../store/alertStore';
import UserAccountSection from '../../components/common/UserAccountSection';
import FamilyManager from './FamilyManager';
import GuardianManager from './GuardianManager';
import type { Student } from './types';
import Badge from '../../components/ui/Badge';
import SecureFilePreview from '../../components/common/SecureFilePreview';

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
                            />
                            <DetailItem
                                label="Usia"
                                value={age ? `${age} tahun` : '-'}
                            />
                        </div>
                        <DetailItem
                            label="Tempat, Tanggal Lahir"
                            value={`${student.place_of_birth || '-'}, ${formatDate(student.date_of_birth)}`}
                        />
                    </div>

                    <div className="space-y-5">
                        <DetailItem
                            label="NIK"
                            value={student.nik}
                        />
                        <DetailItem
                            label="No. KK"
                            value={student.no_kk}
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
                            label="Tahun Keluar"
                            value={student.exit_year || '-'}
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

// AccountCard replaced with common UserAccountSection component

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
    const [activeTab, setActiveTab] = useState<'overview' | 'family' | 'academic' | 'documents' | 'account'>('overview');
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    const { data: student, isLoading, isError } = useStudentDetail(id || null);
    const exportBiodataMutation = useExportStudentBiodata();
    const printMutation = usePrintStudentBiodata();
    const unlinkMutation = useUnlinkStudentFromUser();
    const linkMutation = useLinkStudentToUser();
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

    const handleLink = (studentId: string, userId: string) => {
        linkMutation.mutate({ studentId, userId });
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
        id: 'overview' | 'family' | 'academic' | 'documents' | 'account';
        label: string;
        icon: LucideIcon;
        count?: number;
    }

    const tabs: TabItem[] = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'academic', label: 'Akademik', icon: School },
        { id: 'family', label: 'Keluarga', icon: Users },
        { id: 'documents', label: 'Dokumen', icon: FileText },
        { id: 'account', label: 'Akun', icon: ShieldCheck },
    ];

    const statusConfig = getStatusConfig(student.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Student Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Siswa', href: '/dashboard/students', icon: Users },
                                { label: student.full_name }
                            ]}
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-3xl border-4 border-white shadow-lg">
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
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:ml-auto flex flex-wrap gap-2">
                                {/* Download Dropdown */}
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Unduh
                                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Button>

                                    {isDownloadOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsDownloadOpen(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                                                <button
                                                    onClick={() => {
                                                        handleExportBiodata();
                                                        setIsDownloadOpen(false);
                                                    }}
                                                    disabled={exportBiodataMutation.isPending}
                                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                                        <Download size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">Export PDF</div>
                                                        <div className="text-xs text-gray-500">Unduh biodata siswa</div>
                                                    </div>
                                                    {exportBiodataMutation.isPending && (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    )}
                                                </button>
                                                <div className="border-t border-gray-100"></div>
                                                <button
                                                    onClick={() => {
                                                        handlePrintBiodata();
                                                        setIsDownloadOpen(false);
                                                    }}
                                                    disabled={printMutation.isPending}
                                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                                                        <Printer size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">Cetak Biodata</div>
                                                        <div className="text-xs text-gray-500">Buka di tab baru</div>
                                                    </div>
                                                    {printMutation.isPending && (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Edit Button */}
                                <Button
                                    onClick={() => navigate(`/dashboard/students/${id}/edit`)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Edit size={16} className="mr-2" /> Edit Data
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

                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Dokumen Pendukung</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                {(!student.birth_certificate_file_url &&
                                    !student.family_card_file_url &&
                                    !student.parent_statement_file_url &&
                                    !student.student_statement_file_url &&
                                    !student.health_insurance_file_url &&
                                    !student.diploma_certificate_file_url &&
                                    !student.graduation_certificate_file_url &&
                                    !student.financial_hardship_letter_file_url
                                ) ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p>Belum ada dokumen yang diunggah</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: 'Akta Kelahiran', url: student.birth_certificate_file_url, color: 'blue' },
                                            { label: 'Kartu Keluarga', url: student.family_card_file_url, color: 'purple' },
                                            { label: 'Surat Pernyataan Orang Tua', url: student.parent_statement_file_url, color: 'green' },
                                            { label: 'Surat Pernyataan Siswa', url: student.student_statement_file_url, color: 'orange' },
                                            { label: 'Kartu Asuransi Kesehatan', url: student.health_insurance_file_url, color: 'red' },
                                            { label: 'Ijazah Terakhir', url: student.diploma_certificate_file_url, color: 'indigo' },
                                            { label: 'Surat Keterangan Lulus', url: student.graduation_certificate_file_url, color: 'pink' },
                                            { label: 'Surat Keterangan Tidak Mampu', url: student.financial_hardship_letter_file_url, color: 'teal' },
                                        ].map((doc, idx) => (
                                            <div key={idx} className="border rounded-lg p-4 bg-gray-50/50">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{doc.label}</h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {doc.url ? 'Dokumen tersedia' : 'Belum diunggah'}
                                                        </p>
                                                    </div>
                                                    <div className={`p-2 rounded-lg ${doc.url ? `bg-${doc.color}-100 text-${doc.color}-600` : 'bg-gray-100 text-gray-400'}`}>
                                                        <FileText size={20} />
                                                    </div>
                                                </div>
                                                {doc.url && (
                                                    <SecureFilePreview
                                                        url={doc.url}
                                                        buttonText="Lihat Dokumen"
                                                        className="w-full justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 h-10 rounded-lg"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <UserAccountSection
                            user={student.user}
                            entityId={student.id}
                            entityType="student"
                            themeColor="blue"
                            onLink={handleLink}
                            onUnlink={handleUnlink}
                            linkLoading={linkMutation.isPending}
                            unlinkLoading={unlinkMutation.isPending}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}