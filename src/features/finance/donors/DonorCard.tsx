import { Phone, MapPin, ChevronRight, Pencil } from 'lucide-react';
import type { Donor } from '../types';
import { useNavigate } from 'react-router-dom';

interface DonorCardProps {
    donor: Donor;
}

const DonorCard = ({ donor }: DonorCardProps) => {
    const navigate = useNavigate();

    const handleViewDetail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/finance/donors/${donor.id}`);
    };



    return (
        <>
            {/* Mobile View */}
            <div
                onClick={handleViewDetail}
                className="md:hidden group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                            <span className="text-xl font-bold">{donor.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">{donor.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <Phone size={12} />
                                <span>{donor.phone || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-3">
                    <div className="pb-3 border-b border-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Alamat</p>
                        <div className="flex items-start gap-1 mt-0.5 text-xs text-gray-700">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{donor.address || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-3 pt-2 text-gray-400">
                    {/* Edit button currently opens modal in list, but we are moving to page. 
                         For now, detail page is the primary action. */}
                    <ChevronRight size={20} className="text-gray-300" />
                </div>
            </div>

            {/* Desktop View */}
            <div
                onClick={handleViewDetail}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Avatar & Name */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 flex-shrink-0">
                        <span className="font-bold">{donor.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{donor.name}</h3>
                        {/* <div className="text-xs text-gray-500 truncate">{donor.email || '-'}</div> */}
                    </div>
                </div>

                {/* Phone */}
                <div className="col-span-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span>{donor.phone || '-'}</span>
                    </div>
                </div>

                {/* Address */}
                <div className="col-span-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="truncate">{donor.address || '-'}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/finance/donors/${donor.id}/edit`);
                        }}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Donatur"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default DonorCard;
