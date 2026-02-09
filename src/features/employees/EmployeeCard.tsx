import { Eye, Trash2, Briefcase, User, Phone } from 'lucide-react';
import type { Employee } from './types';

interface EmployeeCardProps {
    employee: Employee;
    onViewDetail: (id: string) => void;
    onDelete: (id: string) => void;
}

const EmployeeCard = ({ employee, onViewDetail, onDelete }: EmployeeCardProps) => {
    // Helper untuk status badge
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'PNS': return 'bg-green-100 text-green-700 border-green-200';
            case 'Honorer': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Tetap': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Kontrak': return 'bg-purple-100 text-purple-700 border-purple-200';
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
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 flex-shrink-0">
                            <Briefcase size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{employee.full_name}</h3>
                            <div className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(employee.employment_status)}`}>
                                {employee.employment_status || 'Tidak Ada'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {/* Grid Info: NIP | Jabatan */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">NIP</p>
                            <p className="text-xs font-mono text-gray-700 mt-0.5">{employee.nip || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Jabatan</p>
                            <p className="text-xs text-gray-700 mt-0.5 font-medium">{employee.job_title}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Telepon</p>
                            <p className="text-xs text-gray-700 mt-0.5">{employee.phone_number || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Akun</p>
                            {employee.user ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] text-green-700 font-medium">Terhubung</span>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 mt-0.5">Belum</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(employee.id)}
                        className="flex-1 px-3 py-2 bg-teal-50 text-teal-600 text-xs font-medium rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail
                    </button>
                    <button
                        onClick={() => onDelete(employee.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Desktop View (Table-like) */}
            <div
                onClick={() => onViewDetail(employee.id)}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Avatar & Nama */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-100 transition-colors flex-shrink-0">
                        <Briefcase size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{employee.full_name}</h3>
                        <p className="text-xs text-gray-500 font-mono truncate">{employee.nip || 'Tanpa NIP'}</p>
                    </div>
                </div>

                {/* Jabatan */}
                <div className="col-span-2 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {employee.job_title}
                    </div>
                </div>

                {/* Status Kepegawaian */}
                <div className="col-span-2 min-w-0">
                    <div className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase border inline-flex ${getStatusColor(employee.employment_status)}`}>
                        {employee.employment_status || 'Tidak Ada'}
                    </div>
                </div>

                {/* Kontak */}
                <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{employee.phone_number || '-'}</span>
                    </div>
                </div>

                {/* Akun */}
                <div className="col-span-2 flex justify-center">
                    {employee.user ? (
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <User size={12} className="text-green-600" />
                            </div>
                            <span className="text-xs text-green-700 font-medium">Terhubung</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">Belum</span>
                    )}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(employee.id)}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(employee.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Pegawai"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default EmployeeCard;
