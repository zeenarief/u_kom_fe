import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Download, Search, Users, Filter, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useParents, useDeleteParent, useExportParents, useExportParentsPDF } from './parentQueries';
import { useAlertStore } from '../../../store/alertStore';
import Button from '../../../components/ui/Button';
import ParentCard from './ParentCard';
import { useDebounce } from '../../../hooks/useDebounce';

export default function ParentPage() {
    const navigate = useNavigate();
    const exportMutation = useExportParents();
    const exportPDFMutation = useExportParentsPDF();

    // Export Dropdown State
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Filter State
    const [lifeStatusFilter, setLifeStatusFilter] = useState<string>('ALL');
    const [genderFilter, setGenderFilter] = useState<string>('ALL');
    const [occupationFilter, setOccupationFilter] = useState<string>('ALL');

    // Page State
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: parents, isLoading, isError } = useParents({ page, limit, q: debouncedSearch });
    const deleteMutation = useDeleteParent();

    // Filter parents
    const filteredParents = parents?.items.filter(parent => {
        const matchesLifeStatus = lifeStatusFilter === 'ALL' || parent.life_status === lifeStatusFilter;
        const matchesGender = genderFilter === 'ALL' || parent.gender === genderFilter;
        const matchesOccupation = occupationFilter === 'ALL' || parent.occupation === occupationFilter;
        return matchesLifeStatus && matchesGender && matchesOccupation;
    }) || [];

    // Get unique occupations for filter
    const uniqueOccupations = Array.from(new Set(parents?.items.map(p => p.occupation).filter(Boolean))) as string[];

    const handleCreate = () => {
        navigate('/dashboard/parents/create');
    };

    const handleViewDetail = (id: string) => {
        navigate(`/dashboard/parents/${id}`);
    };

    const { showAlert } = useAlertStore();
    const handleDelete = (id: string) => {
        showAlert(
            'Konfirmasi Hapus',
            'Yakin hapus data orang tua ini?',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    const handleExport = () => {
        exportMutation.mutate();
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Data Orang Tua</h1>
                            <p className="text-gray-500 text-sm">Database orang tua siswa.</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-1 mt-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total</div>
                            <div className="text-xl font-bold text-gray-900 leading-none mt-0.5">{parents?.meta.total_items || 0}</div>
                        </div>
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Hidup</div>
                            <div className="text-xl font-bold text-green-600 leading-none mt-0.5">
                                {parents?.items.filter(p => p.life_status === 'alive').length || 0}
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Meninggal</div>
                            <div className="text-xl font-bold text-gray-600 leading-none mt-0.5">
                                {parents?.items.filter(p => p.life_status === 'deceased').length || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* EXPORT DROPDOWN */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                            <Download className="w-4 h-4 mr-2" /> Export <ChevronDown className="w-3 h-3 ml-2" />
                        </Button>

                        {isExportOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsExportOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            handleExport();
                                            setIsExportOpen(false);
                                        }}
                                        disabled={exportMutation.isPending}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                        Export Excel
                                        {exportMutation.isPending && <span className="text-xs text-gray-400 ml-auto">...</span>}
                                    </button>
                                    <div className="border-t border-gray-50"></div>
                                    <button
                                        onClick={() => {
                                            exportPDFMutation.mutate();
                                            setIsExportOpen(false);
                                        }}
                                        disabled={exportPDFMutation.isPending}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FileText className="w-4 h-4 text-red-600" />
                                        Export PDF
                                        {exportPDFMutation.isPending && <span className="text-xs text-gray-400 ml-auto">...</span>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Data
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
                                placeholder="Cari nama, NIK, email, atau telepon..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <select
                                value={lifeStatusFilter}
                                onChange={(e) => setLifeStatusFilter(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer min-w-32"
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="alive">Hidup</option>
                                <option value="deceased">Meninggal</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer min-w-32"
                            >
                                <option value="ALL">Semua Gender</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {uniqueOccupations.length > 0 && (
                            <div className="relative">
                                <select
                                    value={occupationFilter}
                                    onChange={(e) => setOccupationFilter(e.target.value)}
                                    className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer min-w-32"
                                >
                                    <option value="ALL">Semua Pekerjaan</option>
                                    {uniqueOccupations.map(occupation => (
                                        <option key={occupation} value={occupation}>{occupation}</option>
                                    ))}
                                </select>
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {(lifeStatusFilter !== 'ALL' || genderFilter !== 'ALL' || occupationFilter !== 'ALL') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setLifeStatusFilter('ALL');
                                    setGenderFilter('ALL');
                                    setOccupationFilter('ALL');
                                }}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Header for Desktop */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                <div className="col-span-3">IDENTITAS</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-2">GENDER</div>
                <div className="col-span-2">KONTAK</div>
                <div className="col-span-2">PEKERJAAN</div>
                <div className="col-span-1 text-right">AKSI</div>
            </div>

            {/* CONTENT: Parent Cards */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data orang tua...</p>
                </div>
            ) : (
                <>
                    {filteredParents.length > 0 ? (
                        <div className="space-y-3">
                            {filteredParents.map((parent) => (
                                <ParentCard
                                    key={parent.id}
                                    parent={parent}
                                    onViewDetail={handleViewDetail}
                                    onDelete={handleDelete}
                                />
                            ))}

                            {/* Pagination and Result Count */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {filteredParents.length} dari {parents?.meta.total_items || 0} orang tua
                                    {(lifeStatusFilter !== 'ALL' || genderFilter !== 'ALL' || occupationFilter !== 'ALL') && (
                                        <span className="ml-1">
                                            (difilter)
                                        </span>
                                    )}
                                </div>

                                {parents?.meta && parents.meta.total_pages > 1 && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            disabled={parents.meta.current_page === 1}
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            className="text-sm px-3 py-1 h-8"
                                        >
                                            Previous
                                        </Button>
                                        <span className="flex items-center text-sm font-medium text-gray-700">
                                            Page {parents.meta.current_page} of {parents.meta.total_pages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            disabled={parents.meta.current_page === parents.meta.total_pages}
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
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search || lifeStatusFilter !== 'ALL' || genderFilter !== 'ALL' || occupationFilter !== 'ALL'
                                    ? 'Orang tua tidak ditemukan'
                                    : 'Belum ada data orang tua'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {search || lifeStatusFilter !== 'ALL' || genderFilter !== 'ALL' || occupationFilter !== 'ALL'
                                    ? 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan.'
                                    : 'Mulai dengan menambahkan data orang tua baru ke dalam sistem.'}
                            </p>
                            <Button onClick={handleCreate} className="mx-auto">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Data Pertama
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}