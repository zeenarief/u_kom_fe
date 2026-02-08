import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateStudent, useStudentDetail } from './studentQueries';
import StudentForm from './StudentForm';
import { useAlertStore } from '../../store/alertStore';
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
        <div className="max-w-4xl mx-auto py-8 px-4">
            <StudentForm
                title="Edit Data Siswa"
                initialData={student}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                isEditMode={true}
            />
        </div>
    );
}
