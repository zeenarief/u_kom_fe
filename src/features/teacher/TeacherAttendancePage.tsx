import { useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useAttendanceHistory, useDeleteAttendance } from './teacherQueries';
import { Plus, Calendar, FileText, Trash2, Edit } from 'lucide-react'; // Changed Eye to Edit for clarity in context
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useAlertStore } from '../../store/alertStore';

const TeacherAttendancePage = () => {
    const { assignmentId } = useParams();
    const queryClient = useQueryClient();
    const { data: history, isLoading } = useAttendanceHistory(assignmentId);
    const deleteAttendanceMutation = useDeleteAttendance();
    const { showAlert } = useAlertStore();

    const handleDelete = (id: string, topic: string) => {
        showAlert(
            'Hapus Absensi',
            `Apakah Anda yakin ingin menghapus data absensi "${topic}"? Data yang dihapus tidak dapat dikembalikan.`,
            'warning',
            () => {
                deleteAttendanceMutation.mutate(id, {
                    onSuccess: () => {
                        toast.success("Data absensi berhasil dihapus");
                        queryClient.invalidateQueries({ queryKey: ['attendance-history', assignmentId] });
                    },
                    onError: () => {
                        toast.error("Gagal menghapus data absensi");
                    }
                });
            },
            () => { }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Link to={`/dashboard/class/${assignmentId}/attendance/input`}>
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Input Kehadiran
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Topik / Materi
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : history?.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada riwayat absensi.
                                    </td>
                                </tr>
                            ) : (
                                history?.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-900">
                                                <Calendar size={16} className="text-gray-400" />
                                                {new Date(session.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-900">
                                                <FileText size={16} className="text-gray-400" />
                                                <span className="font-medium">{session.topic}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1">
                                                <Link
                                                    to={`/dashboard/class/${assignmentId}/attendance/input?schedule_id=${session.schedule_id || ''}&date=${session.date}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Absensi"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(session.id, session.topic)}
                                                    disabled={deleteAttendanceMutation.isPending}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus Riwayat"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendancePage;
