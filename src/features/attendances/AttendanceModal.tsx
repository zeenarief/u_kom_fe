import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useClassroomDetail } from '../admin/classrooms/classroomQueries';
import { useSubmitAttendance, useCheckAttendanceSession } from './attendanceQueries';
import type { Schedule } from '../admin/schedules/types';
import { Check, Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    schedule: Schedule | null;
    classroomId: string;
}

interface FormValues {
    date: string;
    topic: string;
    notes: string;
}

const STATUSES = [
    { value: 'PRESENT', label: 'Hadir', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'SICK', label: 'Sakit', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'PERMISSION', label: 'Izin', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'ABSENT', label: 'Alpa', color: 'bg-red-100 text-red-700 border-red-200' },
];

// Helper untuk tanggal lokal (WIB aman) format YYYY-MM-DD
const getTodayString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AttendanceModal({ isOpen, onClose, schedule, classroomId }: Props) {
    // State Default untuk tanggal (Local Time)
    // 1. Setup Form
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            date: getTodayString(),
            topic: '',
            notes: ''
        }
    });

    // Watch tanggal agar re-fetch saat user ganti tanggal
    const selectedDate = watch('date');

    // 2. Fetch Data
    const { data: classroom, isLoading: loadingStudents } = useClassroomDetail(isOpen ? classroomId : null);

    // Fetch Existing Attendance (Check ke server)
    const { data: existingSession, isLoading: loadingCheck } = useCheckAttendanceSession(
        isOpen ? schedule?.id : undefined,
        selectedDate
    );

    const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

    // Ref untuk mencegah loop inisialisasi (Safety)
    const processedSessionRef = useRef<string | null>(null);

    // 3. Logic Sinkronisasi State (Edit vs Create)
    useEffect(() => {
        if (!isOpen || !classroom?.students) return;

        // Buat unique key untuk menandai sesi ini: ID_Jadwal + Tanggal + Status_Ada_Data
        const sessionKey = `${schedule?.id}-${selectedDate}-${existingSession ? 'EDIT' : 'NEW'}`;

        // Jika kita sudah memproses sesi ini, skip (mencegah re-render loop)
        if (processedSessionRef.current === sessionKey) return;

        if (existingSession) {

            // Isi form header
            reset({
                date: selectedDate,
                topic: existingSession.topic,
                notes: existingSession.notes || ''
            });

            // Isi map status siswa
            const newMap: Record<string, string> = {};
            existingSession.details.forEach(d => {
                newMap[d.student_id] = d.status;
            });
            setAttendanceMap(newMap);

        } else {

            // Reset form header (kecuali tanggal)
            reset({
                date: selectedDate,
                topic: '',
                notes: ''
            });

            // Default semua siswa PRESENT
            const newMap: Record<string, string> = {};
            classroom.students.forEach(s => {
                newMap[s.id] = 'PRESENT';
            });
            setAttendanceMap(newMap);
        }

        // Tandai sudah diproses
        processedSessionRef.current = sessionKey;

    }, [isOpen, existingSession, classroom, reset, selectedDate, schedule?.id]);


    // Reset saat modal ditutup
    const handleClose = () => {
        processedSessionRef.current = null; // Reset ref
        onClose();
        setAttendanceMap({});
    };

    const submitMutation = useSubmitAttendance(() => {
        handleClose();
    });

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    const onSubmit = (data: FormValues) => {
        if (!schedule) return;

        const studentsPayload = classroom?.students?.map(s => ({
            student_id: s.id,
            status: attendanceMap[s.id] || 'PRESENT',
            notes: ''
        })) || [];

        const payload = {
            schedule_id: schedule.id,
            date: data.date,
            topic: data.topic,
            notes: data.notes,
            students: studentsPayload
        };

        submitMutation.mutate(payload);
    };

    if (!schedule) return null;

    const studentList = classroom?.students || [];
    const isFetching = loadingStudents || loadingCheck;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Presensi: ${schedule.subject_name}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-[70vh] flex flex-col">
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between items-center">
                        <p><strong>Kelas:</strong> {classroom?.name}</p>
                        {existingSession ? (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
                                Edit Mode
                            </span>
                        ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">
                                Baru
                            </span>
                        )}
                    </div>
                    <p><strong>Guru:</strong> {schedule.teacher_name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Tanggal" type="date" {...register('date', { required: 'Tanggal wajib diisi' })} error={errors.date?.message} />
                    <div></div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b pb-4">
                    <Input label="Materi / Topik" placeholder="Isi materi yang disampaikan hari ini" {...register('topic', { required: 'Materi / Topik wajib diisi' })} error={errors.topic?.message} />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 relative">
                    {isFetching && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                                <span className="text-xs text-gray-500">Sinkronisasi data...</span>
                            </div>
                        </div>
                    )}

                    {studentList.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 italic">Belum ada siswa.</p>
                    ) : (
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Nama Siswa</th>
                                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {studentList.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3">
                                            <p className="font-medium text-gray-900">{student.full_name}</p>
                                            <p className="text-xs text-gray-500">{student.nisn}</p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex justify-center gap-1">
                                                {STATUSES.map((status) => {
                                                    const isSelected = (attendanceMap[student.id] || 'PRESENT') === status.value;
                                                    return (
                                                        <button
                                                            key={status.value}
                                                            type="button"
                                                            onClick={() => handleStatusChange(student.id, status.value)}
                                                            className={`
                                                                px-3 py-1.5 rounded-md text-xs font-bold border transition-all duration-200
                                                                ${isSelected
                                                                    ? status.color + ' ring-2 ring-offset-1 ring-blue-300 shadow-sm transform scale-105'
                                                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'}
                                                            `}
                                                        >
                                                            {status.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 bg-white">
                    <Button type="button" variant="ghost" onClick={handleClose}>Batal</Button>
                    <Button type="submit" isLoading={submitMutation.isPending}>
                        <Check size={16} className="mr-2" />
                        {existingSession ? 'Update Presensi' : 'Simpan Presensi'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}