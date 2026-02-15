import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Users } from 'lucide-react';
import { useDonors } from '../donationQueries';
import Button from '../../../components/ui/Button';
import DonorCard from './DonorCard';
import { useDebounce } from '../../../hooks/useDebounce';

const DonorPage = () => {
    const navigate = useNavigate();

    // Search
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Fetch Data
    const { data: donorsData, isLoading, isError } = useDonors({ name: debouncedSearch });
    const donors = donorsData?.items || [];

    const handleCreate = () => {
        navigate('/dashboard/finance/donors/create');
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data donatur.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Data Donatur</h1>
                            <p className="text-gray-500 text-sm">Kelola data para donatur dan orang baik.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Donatur
                    </Button>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama donatur..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Header for Desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Nama Donatur</div>
                <div className="col-span-3">Kontak</div>
                <div className="col-span-4">Alamat</div>
                <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* CONTENT */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data donatur...</p>
                </div>
            ) : (
                <>
                    {donors.length > 0 ? (
                        <div className="space-y-3">
                            {donors.map((donor) => (
                                <DonorCard
                                    key={donor.id}
                                    donor={donor}
                                />
                            ))}

                            <div className="text-sm text-gray-500 pt-2 text-center">
                                Menampilkan {donors.length} data
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search
                                    ? 'Donatur tidak ditemukan'
                                    : 'Belum ada data donatur'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {search
                                    ? 'Coba ubah kata kunci pencarian Anda.'
                                    : 'Mulai dengan menambahkan donatur baru.'}
                            </p>
                            <Button onClick={handleCreate} className="mx-auto bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Donatur
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DonorPage;
