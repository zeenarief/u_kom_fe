import { useNavigate, useParams } from 'react-router-dom';
import { Users, Edit } from 'lucide-react';
import { useUpdateStudent, useStudentDetail } from './studentQueries';
import StudentForm from './StudentForm';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useAlertStore } from '../../../store/alertStore';
import type { StudentFormInput } from './types';

export default function StudentEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();

    const { data: student, isLoading: isFetching } = useStudentDetail(id || null);
    const updateMutation = useUpdateStudent();

    const handleSubmit = (data: StudentFormInput) => {
        if (!id) return;

        const payload = { ...data };

        updateMutation.mutate({ id, data: payload }, {
            onSuccess: () => {
                navigate(`/dashboard/students/${id}`);
            },
            onError: (err: any) => {
                if (err.response?.status === 409) {
                    showAlert('Gagal', 'NIK sudah digunakan oleh siswa lain.', 'error');
                }
            }
        });
    };

    if (isFetching) return <div className="p-8 text-center text-gray-500">Memuat data siswa...</div>;
    if (!student) return <div className="p-8 text-center text-red-500">Data siswa tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Breadcrumb
                            items={[
                                { label: 'Siswa', href: '/dashboard/students', icon: Users },
                                { label: student.full_name, href: `/dashboard/students/${id}` },
                                { label: 'Edit', icon: Edit }
                            ]}
                        />
                    </div>
                    <div className="p-6">
                        <StudentForm
                            initialData={student}
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
