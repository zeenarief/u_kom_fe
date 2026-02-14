import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessmentDetail, useClassroomStudents, useSubmitScores, type StudentScore, useUpdateAssessment, type CreateAssessmentRequest } from './teacherQueries';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const TeacherScoreInputPage = () => {
    const { assessmentId } = useParams();
    const queryClient = useQueryClient();

    const { data: assessment, isLoading: isLoadingAssessment } = useAssessmentDetail(assessmentId);

    // Once we have assessment, we can get the classroom ID
    const classroomId = assessment?.teaching_assignment?.classroom_id;

    const { data: students, isLoading: isLoadingStudents } = useClassroomStudents(classroomId);

    const submitScoresMutation = useSubmitScores();

    // Local state for scores
    const [scores, setScores] = useState<Record<string, number | ''>>({}); // studentId -> score
    const [feedbacks, setFeedbacks] = useState<Record<string, string>>({}); // studentId -> feedback

    // Initialize scores when assessment/students loaded
    useEffect(() => {
        if (assessment && assessment.scores && students) {
            const initialScores: Record<string, number | ''> = {};
            const initialFeedbacks: Record<string, string> = {};

            // Default empty
            students.forEach(student => {
                initialScores[student.id] = '';
                initialFeedbacks[student.id] = '';
            });

            // Fill with existing scores
            assessment.scores.forEach((s: StudentScore) => {
                initialScores[s.student_id] = s.score;
                initialFeedbacks[s.student_id] = s.feedback || '';
            });

            setScores(initialScores);
            setFeedbacks(initialFeedbacks);
        }
    }, [assessment, students]);

    const handleScoreChange = (studentId: string, value: string) => {
        const numValue = value === '' ? '' : parseFloat(value);
        if (typeof numValue === 'number' && assessment?.max_score && numValue > assessment.max_score) {
            toast.error(`Nilai tidak boleh melebihi ${assessment.max_score}`);
            return;
        }
        setScores(prev => ({ ...prev, [studentId]: numValue }));
    };

    const handleFeedbackChange = (studentId: string, value: string) => {
        setFeedbacks(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSubmit = () => {
        if (!assessment) return;

        const scoresToSubmit = Object.entries(scores)
            .filter(([_, score]) => score !== '') // Only submit filled scores
            .map(([studentId, score]) => ({
                student_id: studentId,
                score: Number(score),
                feedback: feedbacks[studentId]
            }));

        submitScoresMutation.mutate({
            assessment_id: assessment.id,
            scores: scoresToSubmit,
        }, {
            onSuccess: () => {
                toast.success('Nilai berhasil disimpan');
                queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Gagal menyimpan nilai');
            }
        });
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const updateAssessmentMutation = useUpdateAssessment();
    const { register, handleSubmit: handleSubmitEdit, setValue } = useForm<CreateAssessmentRequest>();

    useEffect(() => {
        if (assessment) {
            setValue('title', assessment.title);
            setValue('type', assessment.type);
            setValue('max_score', assessment.max_score);
            setValue('date', assessment.date.split('T')[0]); // Format YYYY-MM-DD
            setValue('description', assessment.description);
        }
    }, [assessment, setValue]);

    const onEditSubmit = (data: CreateAssessmentRequest) => {
        if (!assessment) return;

        // Ensure teaching_assignment_id is included as it is required by backend validation
        const payload = {
            ...data,
            teaching_assignment_id: assessment.teaching_assignment_id
        };

        // Basic validation: max_score shouldn't be less than existing scores (optional but good)
        // For now just update
        updateAssessmentMutation.mutate({ id: assessment.id, data: payload }, {
            onSuccess: () => {
                toast.success('Assessment updated');
                setIsEditModalOpen(false);
                queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.message || 'Failed to update');
            }
        });
    };

    if (isLoadingAssessment || (classroomId && isLoadingStudents)) {
        return <div className="p-6">Loading data...</div>;
    }

    if (!assessment) {
        return <div className="p-6 text-red-600">Assessment not found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to={`/dashboard/grades/${assessment.teaching_assignment_id}`} className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Input Nilai: {assessment.title}</h1>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Assessment"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                    <div className="ml-7 flex gap-4 text-sm text-gray-500">
                        <span>Max Score: <b>{assessment.max_score}</b></span>
                        <span>Type: <b>{assessment.type}</b></span>
                        <span>Date: <b>{new Date(assessment.date).toLocaleDateString('id-ID')}</b></span>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    isLoading={submitScoresMutation.isPending}
                    className="flex items-center gap-2"
                >
                    <Save size={16} />
                    Simpan Semua Nilai
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIM
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Siswa
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Nilai (0-{assessment.max_score})
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Catatan / Feedback
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students?.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.nim || student.nisn || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {student.full_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            min="0"
                                            max={assessment.max_score}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            value={scores[student.id] ?? ''}
                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            value={feedbacks[student.id] ?? ''}
                                            onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                                            placeholder="Catatan untuk siswa..."
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!students || students.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Tidak ada siswa di kelas ini.
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsEditModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmitEdit(onEditSubmit)}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                Edit Assessment
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                                                    <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tipe</label>
                                                    <select {...register('type', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                                                        <option value="ASSIGNMENT">Tugas</option>
                                                        <option value="MID_EXAM">UTS</option>
                                                        <option value="FINAL_EXAM">UAS</option>
                                                        <option value="QUIZ">Kuis</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Max Score</label>
                                                        <input type="number" {...register('max_score', { required: true, min: 1 })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                                        <input type="date" {...register('date', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                                    <textarea {...register('description')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <Button
                                        type="submit"
                                        isLoading={updateAssessmentMutation.isPending}
                                        className="w-full sm:ml-3 sm:w-auto"
                                    >
                                        Simpan Perubahan
                                    </Button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setIsEditModalOpen(false)}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherScoreInputPage;
