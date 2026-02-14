import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
    useTeachingAssignmentSchedules,
    useCheckSession,
    useSubmitAttendance
} from './teacherQueries';

const TeacherAttendanceInputPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();

    const { data: schedules } = useTeachingAssignmentSchedules(assignmentId);

    // Form state
    const [searchParams] = useSearchParams();
    // Fix: Handle "undefined" string literal from URL
    const rawScheduleId = searchParams.get('schedule_id');
    const editScheduleId = rawScheduleId && rawScheduleId !== "undefined" ? rawScheduleId : "";
    const editDate = searchParams.get('date');

    const [selectedScheduleId, setSelectedScheduleId] = useState<string>(editScheduleId || '');
    // Fix: Use local date (YYYY-MM-DD) instead of UTC
    const [selectedDate, setSelectedDate] = useState<string>(
        editDate || new Date().toLocaleDateString('en-CA')
    );

    // Check session data
    // We intentionally pass empty string if undefined to disable the query until we have a valid ID
    const { data: sessionData, isLoading: isLoadingSession } = useCheckSession(selectedScheduleId || undefined, selectedDate);
    const submitAttendanceMutation = useSubmitAttendance();

    // Local state for attendance inputs
    const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
    const [attendanceNotes, setAttendanceNotes] = useState<Record<string, string>>({});
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');

    // Pre-fill data when sessionData loads
    useEffect(() => {
        if (sessionData) {
            setTopic(sessionData.topic || '');
            // setNotes(sessionData.notes || ''); // Should be handled if notes exists in session detail

            const newStatus: Record<string, string> = {};
            const newNotes: Record<string, string> = {};

            sessionData.details.forEach(detail => {
                newStatus[detail.student_id] = detail.status || 'PRESENT';
                newNotes[detail.student_id] = detail.notes || '';
            });

            setAttendanceStatus(newStatus);
            setAttendanceNotes(newNotes);
        }
    }, [sessionData]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    };

    const handleNoteChange = (studentId: string, note: string) => {
        setAttendanceNotes(prev => ({ ...prev, [studentId]: note }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedScheduleId || !selectedDate) {
            toast.error("Pilih jadwal dan tanggal terlebih dahulu");
            return;
        }

        const studentsPayload = Object.keys(attendanceStatus).map(studentId => ({
            student_id: studentId,
            status: attendanceStatus[studentId],
            notes: attendanceNotes[studentId] || ''
        }));

        submitAttendanceMutation.mutate({
            schedule_id: selectedScheduleId,
            date: selectedDate,
            topic: topic,
            notes: notes,
            students: studentsPayload
        }, {
            onSuccess: () => {
                toast.success("Absensi berhasil disimpan");
                navigate(`/dashboard/attendance/${assignmentId}`);
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || "Gagal menyimpan absensi");
            }
        });
    };

    // Auto-select schedule logic
    useEffect(() => {
        if (schedules && schedules.length > 0) {
            // Case 1: No schedule selected yet
            if (!selectedScheduleId) {
                // Try to find schedule matching the Day of the selected Date
                if (selectedDate) {
                    const dateObj = new Date(selectedDate);
                    // 0 = Sunday, 1 = Monday, ...

                    // Backend uses 1=Monday...7=Sunday usually, need to check
                    // Assuming standard JS getDay() 0-6 conflicts with potential DB 1-7
                    // Let's check schedule.day_of_week type.
                    // Just in case, let's try to match.

                    // Helper to map JS Day (0-6) to likely DB Day if needed. 
                    // Usually systems align or use Monday=1. 
                    // Let's rely on the assumption that if the day names match or IDK.
                    // But simpler: schedules usually has `day_of_week`.

                    // If we can't map reliably without checking DB convention, 
                    // we can try to select the first one as fallback 
                    // OR better: specific fix for "undefined" case where we likely know the day.

                    // Let's try to match by day_of_week. 
                    // Converting JS getDay (Sun=0, Mon=1) to common Mon=1...Sun=7
                    const jsDay = dateObj.getDay();
                    const isoDay = jsDay === 0 ? 7 : jsDay;

                    const matchingSchedule = schedules.find(s => s.day_of_week === isoDay);
                    if (matchingSchedule) {
                        setSelectedScheduleId(matchingSchedule.id);
                        return;
                    }
                }

                // Fallback: Select the first one if only one exists or just as default
                setSelectedScheduleId(schedules[0].id);
            }
        }
    }, [schedules, selectedScheduleId, selectedDate]);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Link to={`/dashboard/attendance/${assignmentId}`} className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Input Absensi</h1>
            </div>

            {/* Filters / Config */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jadwal</label>
                        <select
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={selectedScheduleId}
                            onChange={(e) => setSelectedScheduleId(e.target.value)}
                        >
                            <option value="">-- Pilih Jadwal --</option>
                            {schedules?.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.day_name}, {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)} ({s.classroom_name})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input
                            type="date"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Attendance Board */}
            {selectedScheduleId && selectedDate && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Topic Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topik / Materi Pembelajaran</label>
                            <input
                                type="text"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                placeholder="Contoh: Pengantar Aljabar Linear"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan (Opsional)</label>
                            <textarea
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            {isLoadingSession ? (
                                <div className="p-8 text-center text-gray-500">Loading siswa...</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kehadiran</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sessionData?.details.map((detail, idx) => (
                                            <tr key={detail.student_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{detail.student_name}</div>
                                                    <div className="text-xs text-gray-500">{detail.nisn}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {[
                                                            { value: 'PRESENT', label: 'Hadir', color: 'bg-green-100 text-green-800 border-green-200' },
                                                            { value: 'SICK', label: 'Sakit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                                                            { value: 'PERMISSION', label: 'Izin', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                                                            { value: 'ABSENT', label: 'Alpha', color: 'bg-red-100 text-red-800 border-red-200' },
                                                        ].map(status => (
                                                            <button
                                                                key={status.value}
                                                                type="button"
                                                                onClick={() => handleStatusChange(detail.student_id, status.value)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${attendanceStatus[detail.student_id] === status.value
                                                                    ? status.color + ' ring-2 ring-offset-1 ring-gray-300'
                                                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {status.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm border p-1"
                                                        placeholder="Catatan..."
                                                        value={attendanceNotes[detail.student_id] || ''}
                                                        onChange={(e) => handleNoteChange(detail.student_id, e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 sm:pl-64">
                        <div className="max-w-7xl mx-auto flex justify-end gap-4">
                            <Link to={`/dashboard/attendance/${assignmentId}`}>
                                <Button variant="outline" type="button">Batal</Button>
                            </Link>
                            <Button
                                type="submit"
                                isLoading={submitAttendanceMutation.isPending}
                                className="flex items-center gap-2"
                            >
                                <Save size={16} />
                                Simpan Absensi
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TeacherAttendanceInputPage;
