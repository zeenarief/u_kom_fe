import { Calendar, FileText, Users, Edit, Trash2 } from 'lucide-react';
import type { AttendanceHistory } from '../teacherQueries';

interface TeacherAttendanceCardProps {
    session: AttendanceHistory;
    onEdit: (session: AttendanceHistory) => void;
    onDelete: (id: string, topic: string) => void;
}

const TeacherAttendanceCard = ({ session, onEdit, onDelete }: TeacherAttendanceCardProps) => {
    return (
        <>
            {/* Mobile View (hidden on desktop) */}
            <div
                className="md:hidden group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onEdit(session)}
            >
                {/* Header: Date, Topic */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">
                                {new Date(session.date).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                <FileText size={12} className="text-gray-400" />
                                <span className="truncate">{session.topic}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${session.count_absent > 0
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                        }`}>
                        <Users size={12} />
                        {session.count_absent} Siswa Tidak Hadir
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(session)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(session.id, session.topic)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Desktop View (Table-like) */}
            <div
                onClick={() => onEdit(session)}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Date & Topic */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate text-sm">
                            {new Date(session.date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <FileText size={12} className="text-gray-400" />
                            <span className="truncate">{session.topic}</span>
                        </div>
                    </div>
                </div>

                {/* Absent Count */}
                <div className="col-span-4 min-w-0">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${session.count_absent > 0
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                        <Users size={12} />
                        {session.count_absent > 0
                            ? `${session.count_absent} Siswa Tidak Hadir`
                            : 'Semua Hadir'}
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onEdit(session)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Absensi"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(session.id, session.topic)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Riwayat"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default TeacherAttendanceCard;
