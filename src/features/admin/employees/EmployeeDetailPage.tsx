import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Edit, User, Briefcase, Phone, Users, ShieldCheck, FileText } from 'lucide-react';
import { formatDate } from '../../../lib/date';
import Button from '../../../components/ui/Button';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useEmployeeDetail, useUnlinkEmployeeFromUser, useLinkEmployeeToUser } from './employeeQueries';
import { useAlertStore } from '../../../store/alertStore';
import UserAccountSection from '../../../components/common/UserAccountSection';
import type { Employee } from './types';

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="border-b border-gray-100 py-2 last:border-0">
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="block text-sm text-gray-900 mt-1 font-medium">{value || '-'}</span>
    </div>
);

// Quick Stats Component
const EmployeeStats = ({ employee }: { employee: Employee }) => {
    const stats = [
        {
            label: 'Status',
            value: employee.employment_status || 'Tidak Ada',
            color: employee.employment_status === 'PNS' ? 'green' : employee.employment_status === 'Honorer' ? 'yellow' : 'blue',
            icon: FileText
        },
        {
            label: 'Akun',
            value: employee.user ? 'Terhubung' : 'Belum',
            color: employee.user ? 'green' : 'amber',
            icon: ShieldCheck
        },
        {
            label: 'Jabatan',
            value: employee.job_title || '-',
            color: 'teal',
            icon: Briefcase
        },
        {
            label: 'NIP',
            value: employee.nip || '-',
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
                                <p className={`text - lg font - bold text - gray - 900 mt - 1 truncate`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p - 2 rounded - lg bg - ${stat.color} -100 text - ${stat.color} -600`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default function EmployeeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'personal' | 'employment'>('personal');

    const { data: employee, isLoading, isError } = useEmployeeDetail(id || null);
    const unlinkMutation = useUnlinkEmployeeFromUser();
    const linkMutation = useLinkEmployeeToUser();
    const { showAlert } = useAlertStore();

    const handleEdit = () => {
        navigate(`/dashboard/employees/${id}/edit`);
    };

    const handleUnlink = () => {
        if (!employee) return;
        showAlert(
            'Konfirmasi Putus Akun',
            `Yakin ingin memutuskan hubungan akun "${employee.user?.username}" dengan pegawai "${employee.full_name}"?`,
            'warning',
            () => unlinkMutation.mutate(employee.id),
            () => { }
        );
    };

    const handleLink = (employeeId: string, userId: string) => {
        linkMutation.mutate({ employeeId, userId });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-500">Memuat data pegawai...</p>
                </div>
            </div>
        );
    }

    if (isError || !employee) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-500 mb-6">Tidak dapat memuat data pegawai. Silakan coba lagi.</p>
                    <Button onClick={() => navigate('/dashboard/employees')}>
                        Kembali ke Daftar Pegawai
                    </Button>
                </div>
            </div>
        );
    }

    // Helper untuk status badge
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'PNS': return 'bg-green-100 text-green-700 border-green-200';
            case 'Honorer': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Tetap': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Kontrak': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const tabs = [
        { id: 'personal' as const, label: 'Data Pribadi', icon: User },
        { id: 'employment' as const, label: 'Data Kepegawaian', icon: Briefcase },
    ];

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
                                { label: 'Pegawai', href: '/dashboard/employees', icon: Users },
                                { label: employee.full_name }
                            ]}
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-3xl border-4 border-white shadow-lg">
                                        {employee.full_name.charAt(0)}
                                    </div>
                                    {employee.employment_status && (
                                        <div className="absolute -bottom-2 -right-2">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${getStatusColor(employee.employment_status)}`}>
                                                {employee.employment_status}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{employee.full_name}</h1>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:ml-auto flex flex-wrap gap-2">
                                {/* Edit Button */}
                                <Button
                                    onClick={handleEdit}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <Edit size={16} className="mr-2" /> Edit Data
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <EmployeeStats employee={employee} />
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
                                                ? 'text-teal-600 bg-teal-50 rounded-lg'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg'
                                            }
                                        `}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Data Pribadi */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <User size={18} className="text-teal-600" />
                                        <h3 className="font-semibold text-gray-900">Data Pribadi</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2">
                                            <DetailRow label='Nama Lengkap' value={employee.full_name} />
                                            <DetailRow label="NIK" value={employee.nik} />

                                        </div>
                                        <div className="grid grid-cols-2">
                                            <DetailRow
                                                label="Jenis Kelamin"
                                                value={employee.gender === 'male' ? 'Laki-laki' : employee.gender === 'female' ? 'Perempuan' : '-'}
                                            />
                                            <DetailRow
                                                label="Tanggal Lahir"
                                                value={employee.date_of_birth ? formatDate(employee.date_of_birth) : '-'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Data Pribadi */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Phone size={18} className="text-teal-600" />
                                        <h3 className="font-semibold text-gray-900">Kontak & Alamat</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-4">
                                            <DetailRow label='No. Telp' value={employee.phone_number} />
                                            <div className="col-span-3">
                                                <DetailRow label="Alamat" value={employee.address} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'employment' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Data Kepegawaian */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={18} className="text-teal-600" />
                                        <h3 className="font-semibold text-gray-900">Data Kepegawaian</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2">
                                            <DetailRow label="NIP" value={employee.nip} />
                                            <DetailRow label="Jabatan" value={employee.job_title} />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <DetailRow label="Status Kepegawaian" value={employee.employment_status} />
                                            <DetailRow
                                                label="Tanggal Bergabung"
                                                value={employee.join_date ? formatDate(employee.join_date) : '-'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Akun Sistem */}
                            <UserAccountSection
                                user={employee.user}
                                entityId={employee.id}
                                entityType="employee"
                                themeColor="teal"
                                onLink={handleLink}
                                onUnlink={handleUnlink}
                                linkLoading={linkMutation.isPending}
                                unlinkLoading={unlinkMutation.isPending}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
