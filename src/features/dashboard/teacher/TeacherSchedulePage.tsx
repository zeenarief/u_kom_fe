import { useTeacherSchedules } from '../../../features/schedules/scheduleQueries';
import { useAuthStore } from '../../../store/authStore';
import { Clock, BookOpen, MapPin } from 'lucide-react';
import type { Schedule } from '../../../features/schedules/types';

const TeacherSchedulePage = () => {
    const { user } = useAuthStore();
    const teacherId = user?.profile_context?.entity_id;
    const { data: schedules, isLoading } = useTeacherSchedules(teacherId);

    const dayNames = ["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    // Group schedules by day
    const groupedSchedules: Record<number, Schedule[]> = {};
    if (schedules) {
        [1, 2, 3, 4, 5, 6].forEach(day => {
            groupedSchedules[day] = schedules.filter((s: Schedule) => s.day_of_week === day);
        });
    }

    if (isLoading) return <div className="p-6">Loading schedule...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Jadwal Mengajar Saya</h1>

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
                                groupedSchedules[day]?.map((s: Schedule) => (
                                    <div key={s.id} className="border-l-4 border-blue-500 bg-blue-50/50 p-3 rounded-r-lg hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-1 text-xs font-mono text-blue-700 mb-1">
                                            <Clock size={12} />
                                            {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                                        </div>
                                        <div className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-2">
                                            <BookOpen size={14} className="text-gray-400" />
                                            {s.subject_name}
                                        </div>
                                        <div className="text-xs text-gray-600 flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            {s.classroom_name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherSchedulePage;
