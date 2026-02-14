
import { useAuthStore } from '../../../store/authStore';
import {
    Users,
    Calendar,
    BookOpen,
    FileText,
    Clock,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useTeacherDashboardStats, useTeacherTodaySchedule } from '../../teacher/teacherQueries';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const { data: stats, isLoading: isLoadingStats } = useTeacherDashboardStats();
    const { data: todaySchedule, isLoading: isLoadingSchedule } = useTeacherTodaySchedule();

    const isLoading = isLoadingStats || isLoadingSchedule;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-6 bg-gray-200 rounded w-10"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Halo, {user?.name}! 👋</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Selamat datang di Dashboard Guru.
                            {stats?.pending_attendance && stats.pending_attendance > 0 ? (
                                <span className="text-orange-600 font-medium ml-1">
                                    Anda memiliki {stats.pending_attendance} kelas yang belum diabsen hari ini.
                                </span>
                            ) : (
                                " Semangat mengajar hari ini!"
                            )}
                        </p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg font-medium border border-teal-100 flex items-center gap-2">
                        <Users size={18} />
                        Status: Guru / Pengajar
                    </div>
                </div>
            </div>

            {/* Teacher Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jadwal Hari Ini</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats?.total_classes_today || 0} Kelas</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Siswa Ajar</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats?.total_students || 0} Siswa</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stats?.pending_attendance && stats.pending_attendance > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Absensi</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats?.pending_attendance || 0} Kelas</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Jadwal Hari Ini</h3>
                        <Link to="/dashboard/schedules" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="p-6">
                        {!todaySchedule || todaySchedule.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                <p>Tidak ada jadwal mengajar hari ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todaySchedule.map((schedule) => (
                                    <div key={schedule.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
                                        <div className="flex-shrink-0 w-16 text-center bg-blue-50 text-blue-700 rounded-lg py-2 border border-blue-100">
                                            <div className="text-xs font-semibold uppercase">{schedule.day_name}</div>
                                            <div className="text-sm font-bold">{schedule.start_time.substring(0, 5)}</div>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-900">{schedule.subject_name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    {schedule.classroom_name}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Since we don't have assignment ID directly in schedule response usually, we might rely on listing assignments separately. 
                                            But for quick action, if we can link to attendance, great. 
                                            If not, just display info. 
                                            Looking at ScheduleResponse, it has ID but not AssignmentID explicitly unless it's the same. 
                                            Usually Schedule is part of Assignment.
                                            For now, let's keep it informational or link to the classes page.
                                        */}
                                        <Link
                                            to="/dashboard/classes"
                                            className="ml-auto inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-full transition-colors"
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4">Menu Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/dashboard/schedules" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2 text-center group">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar size={20} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Jadwal Mengajar</span>
                        </Link>
                        <Link to="/dashboard/grades" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2 text-center group">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Input Nilai</span>
                        </Link>
                        {/* 
                           Bank Soal - Placeholder for now as it doesn't seem to have a route yet. 
                           Maybe link to Assignments or similar? Or remove if unused. 
                           I'll keep it but point to # for now or remove if requested to be strict.
                           The previous code had it. I'll remove "Bank Soal" as it's likely not implemented and user wanted "Real Data".
                           I will replace it with 'Daftar Kelas' which is real.
                        */}
                        <Link to="/dashboard/classes" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2 text-center group">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Daftar Kelas</span>
                        </Link>
                        <Link to="/dashboard/attendance" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 transition gap-2 text-center group">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Absensi</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
