import { Users, Eye, Trash2, Phone, Briefcase } from 'lucide-react';
import type { Parent } from './types';

interface ParentCardProps {
    parent: Parent;
    onViewDetail: (id: string) => void;
    onDelete: (id: string) => void;
}

const ParentCard = ({ parent, onViewDetail, onDelete }: ParentCardProps) => {
    // Helper untuk life status badge
    const getLifeStatusColor = (status?: string) => {
        switch (status) {
            case 'alive': return 'bg-green-100 text-green-700 border-green-200';
            case 'deceased': return 'bg-gray-100 text-gray-700 border-gray-200';
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
                        <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 flex-shrink-0">
                            <Users size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{parent.full_name}</h3>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">

                    {/* Gender and Status Info */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Gender</p>
                            <p className="text-xs text-gray-700 mt-0.5 font-mono">{parent.gender === 'male' ? 'Laki-laki' : parent.gender === 'female' ? 'Perempuan' : '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Status</p>
                            <p className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getLifeStatusColor(parent.life_status)}`}>{parent.life_status === 'alive' ? 'Hidup' : 'Meninggal'}</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Telepon</p>
                            <p className="text-xs text-gray-700 mt-0.5 font-mono">{parent.phone_number || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Pekerjaan</p>
                            <p className="text-xs text-gray-700 mt-0.5 truncate">{parent.occupation || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(parent.id)}
                        className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail
                    </button>
                    <button
                        onClick={() => onDelete(parent.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Desktop View (Table-like) */}
            <div
                onClick={() => onViewDetail(parent.id)}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Avatar & Nama */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 group-hover:bg-purple-100 transition-colors flex-shrink-0">
                        <Users size={20} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{parent.full_name}</h3>
                    </div>
                </div>

                {/* Status */}
                <div className="col-span-2 min-w-0">
                    <div className={`text-sm inline-flex font-medium text-gray-900 truncate items-center rounded-md border ${getLifeStatusColor(parent.life_status)}`}>
                        {parent.life_status === 'alive' ? 'Hidup' : 'Meninggal'}
                    </div>
                </div>

                {/* Gender */}
                <div className="col-span-2 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {parent.gender === 'male' ? 'Laki-laki' : parent.gender === 'female' ? 'Perempuan' : '-'}
                    </div>
                </div>

                {/* Contact */}
                <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400 flex-shrink-0" />
                        <div className="truncate">
                            <span className="font-medium">{parent.phone_number || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Occupation */}
                <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Briefcase size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{parent.occupation || '-'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onViewDetail(parent.id)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(parent.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Orang Tua"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ParentCard;
