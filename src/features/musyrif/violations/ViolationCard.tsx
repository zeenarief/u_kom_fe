import { AlertCircle, Eye, Trash2, Calendar, User } from 'lucide-react';
import type { StudentViolation } from '../types';

interface ViolationCardProps {
    violation: StudentViolation;
    onViewDetail: (id: string) => void;
    onDelete: (id: string) => void;
}

const ViolationCard = ({ violation, onViewDetail, onDelete }: ViolationCardProps) => {
    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 flex-shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{violation.student_name}</h3>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <Calendar size={12} />
                                {new Date(violation.violation_date).toLocaleDateString('id-ID')}
                            </div>
                        </div>
                    </div>
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                        +{violation.points} Poin
                    </span>
                </div>

                <div className="mt-4 space-y-2">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Pelanggaran</p>
                        <p className="text-xs font-medium text-gray-900 mt-0.5">{violation.violation_name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Tindakan</p>
                        <p className="text-xs text-gray-700 mt-0.5 truncate">{violation.action_taken || '-'}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(violation.id)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail
                    </button>
                    <button
                        onClick={() => onDelete(violation.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Desktop View */}
            <div
                onClick={() => onViewDetail(violation.id)}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Tanggal */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{new Date(violation.violation_date).toLocaleDateString('id-ID')}</span>
                </div>

                {/* Siswa */}
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <User size={16} />
                    </div>
                    <span className="font-medium text-gray-900 truncate">{violation.student_name}</span>
                </div>

                {/* Kategori */}
                <div className="col-span-2">
                    <span className="font-medium text-gray-900 truncate">{violation.violation_category || '-'}</span>
                </div>

                {/* Pelanggaran */}
                <div className="col-span-5 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate" title={violation.violation_name}>
                        {violation.violation_name}
                    </div>
                    {violation.notes && (
                        <p className="text-xs text-gray-500 truncate" title={violation.notes}>{violation.notes}</p>
                    )}
                </div>

                {/* Poin */}
                <div className="col-span-1 flex justify-center">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-200">
                        +{violation.points}
                    </span>
                </div>

                {/* Aksi */}
                {/* <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(violation.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(violation.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                    >
                        <Trash2 size={18} />
                    </button>
                </div> */}
            </div>
        </>
    );
};

export default ViolationCard;
