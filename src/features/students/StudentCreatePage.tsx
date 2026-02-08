import { useNavigate } from 'react-router-dom';
import { useCreateStudent } from './studentQueries';
import StudentForm from './StudentForm';
import { useAlertStore } from '../../store/alertStore';
import type { StudentFormInput } from './types';

export default function StudentCreatePage() {
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();

    // Pass navigate back as callback if needed, but react-query onSuccess is better
    const createMutation = useCreateStudent(() => {
        // Optional: extra callback
    });

    const handleSubmit = (data: StudentFormInput) => {
        const payload = { ...data };

        createMutation.mutate(payload, {
            onSuccess: () => {
                navigate('/dashboard/students');
            },
            onError: (err: any) => {
                // Error handling is mostly done in component via react-query, 
                // but we can add specific alerts here if needed.
                // The Form component doesn't have access to setsError directly 
                // unless we pass it down. 
                // For NIK duplicate, we might need a way to pass error back to form.
                // Ideally, React Query's onError in the hook handles general alerts.
                if (err.response?.status === 409) {
                    showAlert('Gagal', 'NIK sudah digunakan oleh siswa lain.', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <StudentForm
                title="Tambah Siswa Baru"
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}
