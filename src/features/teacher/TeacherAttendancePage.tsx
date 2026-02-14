import { useParams, Link } from 'react-router-dom';
import { useAttendanceHistory, useTeacherAssignments } from './teacherQueries';
import { Plus, ArrowLeft, Calendar, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';

const TeacherAttendancePage = () => {
    const { assignmentId } = useParams();
    const { data: history, isLoading } = useAttendanceHistory(assignmentId);

    // Optional: Get assignment details for header title
    const { data: assignments } = useTeacherAssignments();
    const currentAssignment = assignments?.find(a => a.id === assignmentId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/dashboard/classes" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Absensi</h1>
                        <p className="text-sm text-gray-500">Pelajaran: {currentAssignment?.subject?.name} - {currentAssignment?.classroom?.name}</p>
                    </div>
                </div>
                <Link to={`/dashboard/attendance/${assignmentId}/input`}>
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
                                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jadwal
                                </th> */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : history?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
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
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.subject_name} - {session.classroom_name}
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/dashboard/attendance/${assignmentId}/input?schedule_id=${session.schedule_id || ''}&date=${new Date(session.date).toLocaleDateString('en-CA')}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Edit
                                            </Link>
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
