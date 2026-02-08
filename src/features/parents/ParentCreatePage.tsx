import { useNavigate } from 'react-router-dom';
import { useCreateParent } from './parentQueries';
import ParentForm from './ParentForm';
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
        <div className="max-w-4xl mx-auto py-8 px-4">
            <ParentForm
                title="Tambah Orang Tua Baru"
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}
