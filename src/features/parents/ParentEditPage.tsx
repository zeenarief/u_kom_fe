import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateParent, useParentDetail } from './parentQueries';
import ParentForm from './ParentForm';
import { useAlertStore } from '../../store/alertStore';
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
        <div className="max-w-4xl mx-auto py-8 px-4">
            <ParentForm
                title="Edit Data Orang Tua"
                initialData={parent}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                isEditMode={true}
            />
        </div>
    );
}
