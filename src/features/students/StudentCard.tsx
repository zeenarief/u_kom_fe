import { GraduationCap, Eye, Trash2, MapPin, User, BookOpen, Calendar, Mail, Phone } from 'lucide-react';
import type { Student } from './types';

interface StudentCardProps {
    student: Student;
    onViewDetail: (id: string) => void;
    onDelete: (id: string) => void;
}

const StudentCard = ({ student, onViewDetail, onDelete }: StudentCardProps) => {
    // Helper untuk status badge
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'GRADUATED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DROPOUT': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            {/* Mobile View (hidden on desktop) */}
            <div className="md:hidden group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                {/* Header: Avatar, Name, Status */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                            <GraduationCap size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{student.full_name}</h3>
                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                <Mail size={10} /> {student.email || '-'}
                            </p>
                            <div className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(student.status)}`}>
                                {student.status || 'UNASSIGNED'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {/* Grid Info: NISN/NIM | Kelas/Jurusan */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">NISN / NIM</p>
                            <p className="text-xs font-mono text-gray-700 mt-0.5">{student.nisn || '-'} / {student.nim || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Kelas</p>
                            <p className="text-xs text-gray-700 mt-0.5 font-medium">{student.class_name || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Jurusan</p>
                            <p className="text-xs text-gray-700 mt-0.5">{student.major || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Gender</p>
                            <div className="flex items-center gap-1 text-xs text-gray-700 mt-0.5">
                                <User size={12} /> {student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Alamat</p>
                        <div className="flex items-start gap-1.5 text-xs text-gray-600">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="line-clamp-2">
                                {student.address ? `${student.address}, ` : ''}
                                {student.district && `${student.district}, `}
                                {student.city}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(student.id)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail
                    </button>
                    <button
                        onClick={() => onDelete(student.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Desktop View (Table-like) */}
            <div
                onClick={() => onViewDetail(student.id)}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Avatar & Nama */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        <GraduationCap size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{student.full_name}</h3>
                        <p className="text-xs text-gray-500 truncate">
                            {student.email || 'No email'}
                        </p>
                    </div>
                </div>

                {/* NISN & NIM */}
                <div className="col-span-2 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {student.nisn || '-'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {student.nim || 'No NIM'}
                    </div>
                </div>

                {/* Kelas & Jurusan */}
                <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <BookOpen size={14} className="text-gray-400 flex-shrink-0" />
                        <div className="truncate">
                            <span className="font-medium">{student.class_name || '-'}</span>
                            {student.major && (
                                <>
                                    <span className="text-gray-300 mx-2">|</span>
                                    <span className="text-gray-500">{student.major}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alamat */}
                <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{student.district + ', ' + student.city || '-'}</span>
                    </div>
                </div>

                {/* Status */}
                <div className="col-span-2 flex justify-center">
                    <div className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase border ${getStatusColor(student.status)}`}>
                        {student.status || 'UNASSIGNED'}
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(student.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(student.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Siswa"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default StudentCard;