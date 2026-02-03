import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useClassroomDetail } from '../classrooms/classroomQueries';
import { useSubmitAttendance } from './attendanceQueries';
import type { Schedule } from '../../types/api';
import { Check } from 'lucide-react';

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

export default function AttendanceModal({ isOpen, onClose, schedule, classroomId }: Props) {
    const { data: classroom, isLoading: loadingStudents } = useClassroomDetail(
        isOpen ? classroomId : null
    );

    const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

    // Ref untuk melacak apakah kita sudah inisialisasi data untuk kelas ini
    const loadedClassIdRef = useRef<string | null>(null);

    // SOLUSI 1: Hapus useEffect reset (yang menyebabkan error).
    // Pindahkan logika reset ke fungsi handleClose di bawah.

    // Logic Inisialisasi (Mengisi default 'PRESENT')
    useEffect(() => {
        // Cek 1: Data siswa harus ada
        // Cek 2: Pastikan kita belum melakukan inisialisasi untuk kelas ID ini agar tidak loop
        if (classroom?.students && classroom.id !== loadedClassIdRef.current) {

            const initialMap: Record<string, string> = {};
            classroom.students.forEach(s => {
                initialMap[s.id] = 'PRESENT';
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAttendanceMap(initialMap);

            // Tandai bahwa kelas ini sudah di-load
            loadedClassIdRef.current = classroom.id;
        }
    }, [classroom]);

    // SOLUSI 2: Fungsi Reset dijalankan saat user menutup modal
    const handleClose = () => {
        // 1. Reset Ref agar nanti kalau dibuka lagi bisa init ulang
        loadedClassIdRef.current = null;

        // 2. Reset State Map
        setAttendanceMap({});

        // 3. Panggil prop onClose dari parent
        onClose();
    };

    const submitMutation = useSubmitAttendance(() => {
        handleClose(); // Gunakan handleClose agar state ter-reset setelah sukses submit
    });

    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            topic: '',
            notes: ''
        }
    });

    // Key unik untuk me-reset form input saat modal dibuka/tutup
    const formKey = isOpen ? `open-${schedule?.id}` : 'closed';

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

        if (studentsPayload.length === 0) {
            alert("Tidak ada siswa untuk diabsen.");
            return;
        }

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

    return (
        // Gunakan handleClose di sini, BUKAN onClose langsung
        <Modal isOpen={isOpen} onClose={handleClose} title={`Presensi: ${schedule.subject_name}`}>
            <form
                key={formKey}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 h-[70vh] flex flex-col"
            >
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 space-y-1">
                    <p><strong>Kelas:</strong> {classroom?.name}</p>
                    <p><strong>Guru:</strong> {schedule.teacher_name}</p>
                    <p><strong>Waktu:</strong> {schedule.day_name}, {schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                    <Input
                        label="Tanggal"
                        type="date"
                        {...register('date', { required: true })}
                        defaultValue={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                        label="Materi / Topik (Jurnal)"
                        placeholder="Contoh: Bab 1 Pendahuluan"
                        {...register('topic', { required: true })}
                        defaultValue=""
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {loadingStudents ? (
                        <p className="text-center py-4">Loading siswa...</p>
                    ) : studentList.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 italic">Belum ada siswa di kelas ini.</p>
                    ) : (
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Nama Siswa</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Status Kehadiran</th>
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
                                                // Fallback visual agar tidak kosong saat ms inisialisasi
                                                const currentStatus = attendanceMap[student.id] || 'PRESENT';
                                                const isSelected = currentStatus === status.value;
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
                        <Check size={16} className="mr-2" /> Simpan Presensi
                    </Button>
                </div>
            </form>
        </Modal>
    );
}