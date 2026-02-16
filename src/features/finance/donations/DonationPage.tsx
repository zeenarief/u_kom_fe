import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Wallet, Filter, ChevronDown, Package, TrendingUp } from 'lucide-react';
import { useDonations } from '../donationQueries';
import Button from '../../../components/ui/Button';
import DonationCard from './DonationCard';
import { useDebounce } from '../../../hooks/useDebounce';

export default function DonationPage() {
    const navigate = useNavigate();

    // Search & Filter
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [typeFilter, setTypeFilter] = useState<string>('ALL');

    // Page State
    const [page, setPage] = useState(1);
    const limit = 10;

    // Fetch Data
    // Note: API might need 'search' param support or client-side filtering. 
    // Assuming 'type' param is supported. Search usually filters donor name.
    const { data: donationsData, isLoading, isError } = useDonations({
        page,
        limit,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        q: debouncedSearch
    });

    const donations = donationsData?.items || [];

    // Use items from paginated response
    const filteredDonations = donationsData?.items || [];

    const totalMoney = filteredDonations
        .filter(d => d.type === 'MONEY')
        .reduce((sum, d) => sum + (d.total_amount || 0), 0);

    const totalGoods = filteredDonations.filter(d => d.type === 'GOODS').length;

    const handleCreate = () => {
        navigate('/dashboard/finance/donations/create');
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data donasi.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Wallet className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Riwayat Donasi</h1>
                            <p className="text-gray-500 text-sm">Kelola semua pemasukan donasi uang dan barang.</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-1 mt-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit overflow-x-auto max-w-full">
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0 min-w-[120px]">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                <TrendingUp size={10} /> Total Uang
                            </div>
                            <div className="text-lg font-bold text-emerald-600 leading-none mt-1">
                                Rp {totalMoney.toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0 min-w-[100px]">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                                <Package size={10} /> Total Barang
                            </div>
                            <div className="text-lg font-bold text-blue-600 leading-none mt-1">
                                {totalGoods} Transaksi
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" /> Catat Donasi
                    </Button>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama donatur atau keterangan..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white cursor-pointer min-w-32"
                            >
                                <option value="ALL">Semua Tipe</option>
                                <option value="MONEY">Uang</option>
                                <option value="GOODS">Barang</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        {(typeFilter !== 'ALL' || search) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setTypeFilter('ALL');
                                    setSearch('');
                                }}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Header for Desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Tanggal</div>
                <div className="col-span-4">Donatur</div>
                <div className="col-span-3">Nominal / Barang</div>
                <div className="col-span-2">Metode</div>
                <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* CONTENT */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-3 text-gray-500">Memuat riwayat donasi...</p>
                </div>
            ) : (
                <>
                    {filteredDonations.length > 0 ? (
                        <div className="space-y-3">
                            {filteredDonations.map((donation) => (
                                <DonationCard
                                    key={donation.id}
                                    donation={donation}
                                />
                            ))}

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {filteredDonations.length} dari {donationsData?.meta.total_items || 0} data
                                </div>
                                {donationsData?.meta && donationsData.meta.total_pages > 1 && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            disabled={donationsData.meta.current_page === 1}
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            className="text-sm px-3 py-1 h-8"
                                        >
                                            Previous
                                        </Button>
                                        <span className="flex items-center text-sm font-medium text-gray-700">
                                            Page {donationsData.meta.current_page} of {donationsData.meta.total_pages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            disabled={donationsData.meta.current_page === donationsData.meta.total_pages}
                                            onClick={() => setPage((p) => p + 1)}
                                            className="text-sm px-3 py-1 h-8"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Wallet className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search || typeFilter !== 'ALL'
                                    ? 'Tidak ada donasi ditemukan'
                                    : 'Belum ada data donasi'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {search || typeFilter !== 'ALL'
                                    ? 'Coba ubah kata kunci pencarian atau filter Anda.'
                                    : 'Mulai dengan mencatat donasi pertama Anda.'}
                            </p>
                            <Button onClick={handleCreate} className="mx-auto bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="w-4 h-4 mr-2" /> Catat Donasi Baru
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
