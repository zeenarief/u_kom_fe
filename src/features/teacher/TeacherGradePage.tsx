import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTeacherAssessments, useDeleteAssessment, type Assessment } from './teacherQueries';
import { FileText, Calendar, Trash2, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useAlertStore } from '../../store/alertStore';

const TeacherGradePage = () => {
    const { assignmentId } = useParams();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: assessmentsData, isLoading, isError } = useTeacherAssessments(assignmentId, { page, limit });
    const assessments = assessmentsData?.items || [];
    const deleteAssessmentMutation = useDeleteAssessment();
    const { showAlert } = useAlertStore();

    const handleDelete = (id: string, title: string) => {
        showAlert(
            'Hapus Penilaian',
            `Apakah Anda yakin ingin menghapus penilaian "${title}"? Semua nilai siswa yang terkait juga akan dihapus. Data tidak dapat dikembalikan.`,
            'warning',
            () => {
                deleteAssessmentMutation.mutate(id, {
                    onSuccess: () => {
                        toast.success("Penilaian berhasil dihapus");
                        queryClient.invalidateQueries({ queryKey: ['assessments', assignmentId] });
                    },
                    onError: () => {
                        toast.error("Gagal menghapus penilaian");
                    }
                });
            },
            () => { }
        );
    };

    if (isLoading) return <div className="p-6">Loading assessments...</div>;
    if (isError) return <div className="p-6 text-red-600">Failed to load assessments.</div>;

    return (
        <div className="space-y-6">
            {!assessments || assessments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-gray-900 font-medium">Belum ada penilaian</h3>
                    <p className="text-gray-500 text-sm mt-1">Buat penilaian baru untuk mulai menginput nilai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment: Assessment) => (
                        <div key={assessment.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${assessment.type === 'FINAL_EXAM' || assessment.type === 'MID_EXAM'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {assessment.type}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-1">{assessment.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Calendar size={14} />
                                <span>{new Date(assessment.date).toLocaleDateString('id-ID')}</span>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-end gap-2">
                                <Link
                                    to={`/dashboard/grades/assessment/${assessment.id}`}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Input / Edit Nilai"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(assessment.id, assessment.title)}
                                    disabled={deleteAssessmentMutation.isPending}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Penilaian"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {assessmentsData?.meta && assessmentsData.meta.total_pages > 1 && (
                <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                        Menampilkan {assessments.length} dari {assessmentsData.meta.total_items} penilaian
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={assessmentsData.meta.current_page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="text-sm px-3 py-1 h-8"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center text-sm font-medium text-gray-700 px-2">
                            Page {assessmentsData.meta.current_page} of {assessmentsData.meta.total_pages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={assessmentsData.meta.current_page === assessmentsData.meta.total_pages}
                            onClick={() => setPage(p => p + 1)}
                            className="text-sm px-3 py-1 h-8"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherGradePage;
