import { useState } from 'react';
import { useAcademicYears } from '../academic-years/academicYearQueries';
import { useClassrooms } from '../classrooms/classroomQueries';
import { useSchedulesByClass, useDeleteSchedule } from './scheduleQueries';
import Button from '../../components/ui/Button';
import { Plus, Trash2, Calendar, Clock, User, BookOpen } from 'lucide-react';
import ScheduleFormModal from './ScheduleFormModal';

export default function SchedulePage() {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Data Tahun Ajaran & Kelas
    const { data: years } = useAcademicYears();

    // Auto select active year
    if (!selectedYear && years) {
        const active = years.find(y => y.status === 'ACTIVE');
        if (active) setSelectedYear(active.id);
        else if (years.length > 0) setSelectedYear(years[0].id);
    }

    const { data: classrooms } = useClassrooms(selectedYear);

    // 2. Data Jadwal
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
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal Pelajaran</h1>
                    <p className="text-gray-500 text-sm">Atur jadwal mingguan per kelas.</p>
                </div>
            </div>

            {/* FILTER */}
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
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedClassId}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Jadwal
                    </Button>
                </div>
            </div>

            {/* CONTENT: JADWAL GRID */}
            {!selectedClassId ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    Pilih kelas untuk melihat jadwal.
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(day => (
                        <div key={day} className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                            {/* Header Hari */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
                                <span>{dayNames[day]}</span>
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                                    {groupedSchedules[day]?.length || 0} Mapel
                                </span>
                            </div>

                            {/* List Jadwal */}
                            <div className="p-4 space-y-3 flex-1">
                                {groupedSchedules[day]?.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 italic py-4">Libur / Kosong</p>
                                ) : (
                                    groupedSchedules[day]?.map(s => (
                                        <div key={s.id} className="group relative border-l-4 border-blue-500 bg-blue-50/50 p-3 rounded-r-lg hover:bg-blue-50 transition-colors">
                                            {/* Jam */}
                                            <div className="flex items-center gap-1 text-xs font-mono text-blue-700 mb-1">
                                                <Clock size={12} />
                                                {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                            </div>

                                            {/* Mapel */}
                                            <div className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                                                <BookOpen size={14} className="text-gray-400"/>
                                                {s.subject_name}
                                            </div>

                                            {/* Guru */}
                                            <div className="text-xs text-gray-600 flex items-center gap-2">
                                                <User size={14} className="text-gray-400"/>
                                                {s.teacher_name}
                                            </div>

                                            {/* Delete Button (Hover) */}
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Hapus Jadwal"
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

            <ScheduleFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classroomId={selectedClassId}
            />
        </div>
    );
}