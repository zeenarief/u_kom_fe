import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { useCreateParent } from './parentQueries';
import ParentForm from './ParentForm';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useAlertStore } from '../../store/alertStore';
import type { ParentFormInput } from './types';

export default function ParentCreatePage() {
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();

    const createMutation = useCreateParent(() => {
        // Optional: extra callback
    });

    const handleSubmit = (data: ParentFormInput) => {
        const payload = { ...data };

        createMutation.mutate(payload, {
            onSuccess: () => {
                navigate('/dashboard/parents');
            },
            onError: (err: any) => {
                if (err.response?.status === 409) {
                    showAlert('Gagal', 'NIK sudah digunakan oleh orang tua lain.', 'error');
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Orang Tua', href: '/dashboard/parents', icon: Users },
                                { label: 'Tambah Baru', icon: Plus }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <ParentForm
                            title="Tambah Orang Tua Baru"
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
