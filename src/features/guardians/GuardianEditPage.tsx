import { useNavigate, useParams } from 'react-router-dom';
import { Users, Edit } from 'lucide-react';
import { useUpdateGuardian, useGuardianDetail } from './guardianQueries';
import GuardianForm from './GuardianForm';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { GuardianFormInput } from './types';

export default function GuardianEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: guardian, isLoading: isFetching } = useGuardianDetail(id || null);
    const updateMutation = useUpdateGuardian();

    const handleSubmit = (data: GuardianFormInput) => {
        if (!id) return;

        const payload = { ...data };

        updateMutation.mutate({ id, data: payload }, {
            onSuccess: () => {
                navigate(`/dashboard/guardians/${id}`);
            },
        });
    };

    if (isFetching) return <div className="p-8 text-center text-gray-500">Memuat data wali...</div>;
    if (!guardian) return <div className="p-8 text-center text-red-500">Data wali tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Wali', href: '/dashboard/guardians', icon: Users },
                                { label: guardian.full_name, href: `/dashboard/guardians/${id}` },
                                { label: 'Edit', icon: Edit }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <GuardianForm
                            initialData={guardian}
                            onSubmit={handleSubmit}
                            isLoading={updateMutation.isPending}
                            isEditMode={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
