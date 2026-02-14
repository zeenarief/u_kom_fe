import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { useCreateStudent } from './studentQueries';
import StudentForm from './StudentForm';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useAlertStore } from '../../../store/alertStore';
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
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Siswa', href: '/dashboard/students', icon: Users },
                                { label: 'Tambah Baru', icon: Plus }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <StudentForm
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
