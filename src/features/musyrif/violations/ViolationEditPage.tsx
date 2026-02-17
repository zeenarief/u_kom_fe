import { useParams, useNavigate } from 'react-router-dom';
import { useViolation, useUpdateViolation } from '../violationQueries';
import { FileText, Edit, ArrowLeft, AlertCircle } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ViolationForm from './ViolationForm';
import Button from '../../../components/ui/Button';

const ViolationEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch Data
    const { data: violation, isLoading, isError } = useViolation(id || '');
    const updateMutation = useUpdateViolation();

    const handleSubmit = async (data: any) => {
        if (!id) return;
        try {
            await updateMutation.mutateAsync({ id, data });
            navigate(`/dashboard/violations/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Memuat data...</p>
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
                    <Button onClick={() => navigate('/dashboard/violations/history')}>
                        <ArrowLeft size={16} className="mr-2" /> Kembali
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Student Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Pelanggaran Santri', href: '/dashboard/violations/history', icon: FileText },
                                { label: 'Detail Pelanggaran', href: `/dashboard/violations/${id}` },
                                { label: 'Edit Pelanggaran', icon: Edit }
                            ]}
                        />
                    </div>
                    <div className="bg-white p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Edit className="text-blue-600" />
                            Edit Pelanggaran Santri
                        </h2>

                        <ViolationForm
                            initialData={violation}
                            isEdit={true}
                            onSubmit={handleSubmit}
                            isLoading={updateMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViolationEditPage;
