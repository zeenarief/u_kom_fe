import { Calendar, Wallet, Package, CreditCard, ChevronRight, Pencil, Eye } from 'lucide-react';
import type { Donation } from '../types';
import { useNavigate } from 'react-router-dom';

interface DonationCardProps {
    donation: Donation;
}

const DonationCard = ({ donation }: DonationCardProps) => {
    const navigate = useNavigate();

    const handleViewDetail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/finance/donations/${donation.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/finance/donations/${donation.id}/edit`);
    };

    const getTypeColor = (type: string) => {
        return type === 'MONEY'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-blue-100 text-blue-700 border-blue-200';
    };

    const getPaymentMethodColor = (method: string) => {
        return method === 'CASH'
            ? 'bg-gray-100 text-gray-700 border-gray-200'
            : 'bg-indigo-100 text-indigo-700 border-indigo-200';
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
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border flex-shrink-0 ${donation.type === 'MONEY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {donation.type === 'MONEY' ? <Wallet size={20} /> : <Package size={20} />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate text-sm">
                                {donation.donor?.name || 'Hamba Allah'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getTypeColor(donation.type)}`}>
                                    {donation.type === 'MONEY' ? 'Uang' : 'Barang'}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(donation.date).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-50">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                {donation.type === 'MONEY' ? 'Nominal' : 'Jumlah Item'}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">
                                {donation.type === 'MONEY'
                                    ? `Rp ${donation.total_amount?.toLocaleString('id-ID')}`
                                    : `${donation.items?.length || 0} Item`
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Metode</p>
                            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded textxs mt-0.5 font-medium border ${getPaymentMethodColor(donation.payment_method)}`}>
                                <CreditCard size={10} />
                                <span className="text-[10px]">{donation.payment_method}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-2 mt-3 pt-2 text-gray-400">
                    <button
                        onClick={handleEdit}
                        className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                        <Pencil size={16} />
                    </button>
                    <ChevronRight size={20} className="text-gray-300" />
                </div>
            </div>

            {/* Desktop View */}
            <div
                onClick={handleViewDetail}
                className="hidden md:grid md:grid-cols-12 gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer items-center relative group"
            >
                {/* Date */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="font-medium">{new Date(donation.date).toLocaleDateString('id-ID')}</span>
                </div>

                {/* Donor & Type */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${donation.type === 'MONEY' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {donation.type === 'MONEY' ? <Wallet size={18} /> : <Package size={18} />}
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{donation.donor?.name || 'Hamba Allah'}</div>
                        <div className={`mt-0.5 inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getTypeColor(donation.type)}`}>
                            {donation.type === 'MONEY' ? 'Donasi Uang' : 'Donasi Barang'}
                        </div>
                    </div>
                </div>

                {/* Amount / Items */}
                <div className="col-span-3">
                    <div className="text-sm font-bold text-gray-900">
                        {donation.type === 'MONEY'
                            ? `Rp ${donation.total_amount?.toLocaleString('id-ID')}`
                            : `${donation.items?.length || 0} Item Barang`
                        }
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                        {donation.description || '-'}
                    </div>
                </div>

                {/* Method */}
                <div className="col-span-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getPaymentMethodColor(donation.payment_method)}`}>
                        <CreditCard size={12} />
                        {donation.payment_method}
                    </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={handleEdit}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Donasi"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={handleViewDetail}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default DonationCard;
