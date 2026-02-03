import { useState } from 'react';
import { useAcademicYears } from '../academic-years/academicYearQueries';
import { useClassrooms } from '../classrooms/classroomQueries';
import { useSchedulesByClass, useDeleteSchedule } from './scheduleQueries';
import Button from '../../components/ui/Button';
import { Plus, Trash2, Calendar, Clock, User, BookOpen, ClipboardList } from 'lucide-react';
import ScheduleFormModal from './ScheduleFormModal';
import AttendanceModal from '../attendances/AttendanceModal';
import type { Schedule } from '../../types/api';

export default function SchedulePage() {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');

    const [isFormOpen, setIsFormOpen] = useState(false);

    // State untuk Modal Absen
    const [attendanceSchedule, setAttendanceSchedule] = useState<Schedule | null>(null);

    // ... (Bagian Query Years & Classrooms sama persis seperti sebelumnya) ...
    const { data: years } = useAcademicYears();
    if (!selectedYear && years) {
        const active = years.find(y => y.status === 'ACTIVE');
        if (active) setSelectedYear(active.id);
        else if (years.length > 0) setSelectedYear(years[0].id);
    }
    const { data: classrooms } = useClassrooms(selectedYear);
    const { data: schedules, isLoading } = useSchedulesByClass(selectedClassId);
    const deleteMutation = useDeleteSchedule(selectedClassId);

    const handleDelete = (id: string) => {
        if(confirm('Hapus jadwal ini?')) deleteMutation.mutate(id);
    };

    // Helper: Grouping jadwal by Hari
    const groupedSchedules: Record<number, typeof schedules> = {};
    if (schedules) {
        [1, 2, 3, 4, 5, 6].forEach(day => {
            groupedSchedules[day] = schedules.filter(s => s.day_of_week === day);
        });
    }

    const dayNames = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal & Presensi</h1>
                    <p className="text-gray-500 text-sm">Atur jadwal dan isi presensi harian.</p>
                </div>
            </div>

            {/* FILTER (Sama seperti sebelumnya) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm outline-none border"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setSelectedClassId('');
                        }}
                    >
                        {years?.map(y => (
                            <option key={y.id} value={y.id}>{y.name} {y.status === 'ACTIVE' ? '(Aktif)' : ''}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm outline-none border"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        disabled={!selectedYear}
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {classrooms?.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.level}-{c.major})</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        disabled={!selectedClassId}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Jadwal
                    </Button>
                </div>
            </div>

            {/* CONTENT */}
            {!selectedClassId ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    Pilih kelas untuk melihat jadwal dan mengisi absen.
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(day => (
                        <div key={day} className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
                                <span>{dayNames[day]}</span>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                                    {groupedSchedules[day]?.length || 0} Mapel
                                </span>
                            </div>

                            <div className="p-4 space-y-3 flex-1">
                                {groupedSchedules[day]?.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 italic py-4">Tidak ada jadwal</p>
                                ) : (
                                    groupedSchedules[day]?.map(s => (
                                        <div key={s.id} className="group relative border-l-4 border-blue-500 bg-blue-50/50 p-3 rounded-r-lg hover:bg-blue-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-1 text-xs font-mono text-blue-700 mb-1">
                                                        <Clock size={12} />
                                                        {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                                    </div>
                                                    <div className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                                                        <BookOpen size={14} className="text-gray-400"/>
                                                        {s.subject_name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 flex items-center gap-2">
                                                        <User size={14} className="text-gray-400"/>
                                                        {s.teacher_name}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ACTION BUTTONS */}
                                            <div className="mt-3 flex gap-2 border-t border-blue-200 pt-2">
                                                {/* Tombol Absen */}
                                                <button
                                                    onClick={() => setAttendanceSchedule(s)}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-white border border-blue-200 text-blue-700 py-1.5 rounded hover:bg-blue-100 transition-colors shadow-sm"
                                                >
                                                    <ClipboardList size={14} />
                                                    Isi Absen
                                                </button>
                                            </div>

                                            {/* Delete Button (Top Right) */}
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <ScheduleFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                classroomId={selectedClassId}
            />

            {/* MODAL ABSEN */}
            <AttendanceModal
                isOpen={!!attendanceSchedule}
                onClose={() => setAttendanceSchedule(null)}
                schedule={attendanceSchedule}
                classroomId={selectedClassId}
            />
        </div>
    );
}