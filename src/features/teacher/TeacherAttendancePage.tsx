import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendanceHistory, useDeleteAttendance, type AttendanceHistory } from './teacherQueries';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAlertStore } from '../../store/alertStore';
import { useState } from 'react';
import TeacherAttendanceCard from './components/TeacherAttendanceCard';
import Button from '../../components/ui/Button';

const TeacherAttendancePage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data: historyData, isLoading } = useAttendanceHistory(assignmentId, { page, limit });
    const history = historyData?.items || [];
    const deleteAttendanceMutation = useDeleteAttendance();
    const { showAlert } = useAlertStore();

    const handleEdit = (session: AttendanceHistory) => {
        // Format date to YYYY-MM-DD to avoid "invalid date format" error
        const formattedDate = new Date(session.date).toLocaleDateString('en-CA');
        navigate(`/dashboard/class/${assignmentId}/attendance/input?schedule_id=${session.schedule_id || ''}&date=${formattedDate}`);
    };

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



            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">Loading data...</p>
                    </div>
                ) : history?.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-gray-900 font-medium">Belum ada riwayat absensi</h3>
                        <p className="text-gray-500 text-sm mt-1">Mulai dengan menginput kehadiran siswa.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Desktop Header */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                            <div className="col-span-6">TANGGAL & TOPIK</div>
                            <div className="col-span-4">KEHADIRAN</div>
                            <div className="col-span-2 text-right">AKSI</div>
                        </div>

                        {history.map((session) => (
                            <TeacherAttendanceCard
                                key={session.id}
                                session={session}
                                onEdit={handleEdit}
                                onDelete={(id, topic) => handleDelete(id, topic)} // Adapter for slightly different signature
                            />
                        ))}

                        {/* Pagination */}
                        {historyData?.meta && historyData.meta.total_pages > 1 && (
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {history.length} dari {historyData.meta.total_items} sesi
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={historyData.meta.current_page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="text-sm px-3 py-1 h-8"
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center text-sm font-medium text-gray-700 px-2">
                                        Page {historyData.meta.current_page} of {historyData.meta.total_pages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={historyData.meta.current_page === historyData.meta.total_pages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="text-sm px-3 py-1 h-8"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherAttendancePage;
