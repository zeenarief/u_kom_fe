import { Eye, Shield } from 'lucide-react';
import type { Guardian } from './types';

interface GuardianCardProps {
    guardian: Guardian;
    onViewDetail: (id: string) => void;
}

export default function GuardianCard({ guardian, onViewDetail }: GuardianCardProps) {
    return (
        <>
            {/* Mobile View (hidden on desktop) */}
            <div className="md:hidden group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                {/* Header: Avatar, Name */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 flex-shrink-0">
                            <Shield size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{guardian.full_name}</h3>
                            <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-700 border border-orange-200">
                                {guardian.relationship_to_student || 'Wali'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {/* Grid Info */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Kontak</p>
                            <p className="text-xs text-gray-700 mt-0.5 font-medium">{guardian.phone_number}</p>
                            {guardian.email && (
                                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{guardian.email}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">NIK</p>
                            <p className="text-xs font-mono text-gray-700 mt-0.5">{guardian.nik || '-'}</p>
                        </div>
                    </div>

                    {/* User Account Status */}
                    {guardian.user && (
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-700 font-medium">Akun Terhubung: {guardian.user.username}</span>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={() => onViewDetail(guardian.id)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Lihat Detail
                    </button>
                </div>
            </div>

            {/* Desktop View (hidden on mobile) */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center px-5 py-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer"
                onClick={() => onViewDetail(guardian.id)}
            >
                {/* Col 1: Identitas (4 cols) */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Shield size={18} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                            {guardian.full_name}
                        </h3>
                        {guardian.gender && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {guardian.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Col 2: Hubungan (2 cols) */}
                <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-orange-100 text-orange-700 border border-orange-200">
                        {guardian.relationship_to_student || 'Wali'}
                    </span>
                </div>

                {/* Col 3: Kontak (3 cols) */}
                <div className="col-span-3">
                    <p className="text-sm font-medium text-gray-900">{guardian.phone_number}</p>
                    {guardian.email && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{guardian.email}</p>
                    )}
                </div>

                {/* Col 4: NIK (2 cols) */}
                <div className="col-span-2">
                    <p className="text-xs font-mono text-gray-700">{guardian.nik || '-'}</p>
                    {guardian.user && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[10px] text-green-700 font-medium">Terhubung</span>
                        </div>
                    )}
                </div>

                {/* Col 5: Aksi (1 col) */}
                <div className="col-span-1 flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(guardian.id);
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>
        </>
    );
}
