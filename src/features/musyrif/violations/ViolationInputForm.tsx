import { useCreateViolation } from '../violationQueries';
import { AlertCircle, FileText } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ViolationForm from './ViolationForm';
import type { CreateViolationPayload } from '../types';

const ViolationInputForm = () => {
    const createMutation = useCreateViolation();

    const handleSubmit = async (data: CreateViolationPayload) => {
        await createMutation.mutateAsync(data);
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Pelanggaran Santri', href: '/dashboard/violations/history', icon: FileText },
                    { label: 'Input Pelanggaran', icon: AlertCircle }
                ]}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-red-500" />
                    Input Pelanggaran Santri
                </h2>

                <ViolationForm
                    onSubmit={handleSubmit}
                    isLoading={createMutation.isPending}
                    resetOnSuccess={true}
                />
            </div>
        </div>
    );
};

export default ViolationInputForm;
