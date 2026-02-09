import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { useCreateGuardian } from './guardianQueries';
import GuardianForm from './GuardianForm';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { GuardianFormInput } from './types';

export default function GuardianCreatePage() {
    const navigate = useNavigate();

    const createMutation = useCreateGuardian(() => {
        // Optional: extra callback
    });

    const handleSubmit = (data: GuardianFormInput) => {
        const payload = { ...data };

        createMutation.mutate(payload, {
            onSuccess: () => {
                navigate('/dashboard/guardians');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Wali', href: '/dashboard/guardians', icon: Users },
                                { label: 'Tambah Baru', icon: Plus }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <GuardianForm
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
