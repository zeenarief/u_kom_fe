import { useNavigate, useParams } from 'react-router-dom';
import { Users, Edit } from 'lucide-react';
import { useUpdateParent, useParentDetail } from './parentQueries';
import ParentForm from './ParentForm';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useAlertStore } from '../../../store/alertStore';
import type { ParentFormInput } from './types';

export default function ParentEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();

    const { data: parent, isLoading: isFetching } = useParentDetail(id || null);
    const updateMutation = useUpdateParent();

    const handleSubmit = (data: ParentFormInput) => {
        if (!id) return;

        const payload = { ...data };

        updateMutation.mutate({ id, data: payload }, {
            onSuccess: () => {
                navigate(`/dashboard/parents/${id}`);
            },
            onError: (err: any) => {
                if (err.response?.status === 409) {
                    showAlert('Gagal', 'NIK sudah digunakan oleh orang tua lain.', 'error');
                }
            }
        });
    };

    if (isFetching) return <div className="p-8 text-center text-gray-500">Memuat data orang tua...</div>;
    if (!parent) return <div className="p-8 text-center text-red-500">Data orang tua tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Orang Tua', href: '/dashboard/parents', icon: Users },
                                { label: parent.full_name, href: `/dashboard/parents/${id}` },
                                { label: 'Edit', icon: Edit }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <ParentForm
                            initialData={parent}
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
