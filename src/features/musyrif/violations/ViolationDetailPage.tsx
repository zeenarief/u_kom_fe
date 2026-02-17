import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FileText, User, AlertCircle,
    Edit, Trash2
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useViolation, useDeleteViolation } from '../violationQueries';
import { useAlertStore } from '../../../store/alertStore';
import { formatDate } from '../../../lib/date';

const DetailItem = ({ label, value, icon: Icon, className }: { label: string, value: string | number | undefined, icon?: any, className?: string }) => (
    <div className={`space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-gray-400" />}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
);

const ViolationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();

    const { data: violation, isLoading, isError } = useViolation(id || '');
    const deleteMutation = useDeleteViolation();

    const handleDelete = () => {
        if (!violation) return;
        showAlert(
            'Konfirmasi Hapus',
            `Yakin ingin menghapus pelanggaran "${violation.violation_name}" untuk santri ${violation.student_name}?`,
            'warning',
            () => {
                deleteMutation.mutate(violation.id, {
                    onSuccess: () => navigate('/dashboard/violations/history')
                });
            },
            () => { }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-500">Memuat data pelanggaran...</p>
                </div>
            </div>
        );
    }

    if (isError || !violation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                    <p className="text-gray-500 mb-6">Data pelanggaran tidak ditemukan atau telah dihapus.</p>
                    <Button onClick={() => navigate('/dashboard/violations/history')}>
                        <ArrowLeft size={16} className="mr-2" /> Kembali ke Riwayat
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Pelanggaran Santri', href: '/dashboard/violations/history', icon: FileText },
                                { label: 'Detail Pelanggaran' }
                            ]}
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 flex-shrink-0">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{violation.student_name}</h1>
                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                                        <span>NIM: {violation.student_nim || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/dashboard/violations/${id}/edit`)}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <Edit size={16} className="mr-2" /> Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDelete}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 size={16} className="mr-2" /> Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    Informasi Pelanggaran
                                </h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-6">
                                <DetailItem label="Jenis Pelanggaran" value={violation.violation_name} />
                                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                    <DetailItem label="Tanggal Kejadian" value={formatDate(violation.violation_date)} />
                                    <DetailItem label="Poin Sanksi" value={violation.points + ' Poin'} className="text-red-600 font-bold" />
                                </div>
                                <div className="md:col-span-2">
                                    <DetailItem label="Tindakan / Hukuman" value={violation.action_taken} />
                                </div>
                                <div className="md:col-span-2">
                                    <DetailItem label="Catatan Tambahan" value={violation.notes} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViolationDetailPage;
