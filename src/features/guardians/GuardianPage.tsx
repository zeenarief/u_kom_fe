import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Download, Search, Shield, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useGuardians, useExportGuardiansExcel, useExportGuardiansPDF } from './guardianQueries';
import Button from '../../components/ui/Button';
import GuardianCard from './GuardianCard';
import { useDebounce } from '../../hooks/useDebounce';

export default function GuardianPage() {
    const navigate = useNavigate();
    const exportExcelMutation = useExportGuardiansExcel();
    const exportPDFMutation = useExportGuardiansPDF();

    // Export Dropdown State
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Filter State
    const [relationshipFilter, setRelationshipFilter] = useState<string>('ALL');

    const { data: guardians, isLoading, isError } = useGuardians(debouncedSearch);

    // Filter guardians
    const filteredGuardians = guardians?.filter(guardian => {
        const matchesRelationship = relationshipFilter === 'ALL' || guardian.relationship_to_student === relationshipFilter;
        return matchesRelationship;
    }) || [];

    // Get unique relationships for filter
    const uniqueRelationships = Array.from(new Set(guardians?.map(g => g.relationship_to_student).filter(Boolean))) as string[];

    const handleCreate = () => {
        navigate('/dashboard/guardians/create');
    };

    const handleViewDetail = (id: string) => {
        navigate(`/dashboard/guardians/${id}`);
    };

    const handleExportExcel = () => {
        exportExcelMutation.mutate({ q: debouncedSearch });
        setIsExportOpen(false);
    };

    const handleExportPDF = () => {
        exportPDFMutation.mutate({ q: debouncedSearch });
        setIsExportOpen(false);
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Shield className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Data Wali Lainnya</h1>
                            <p className="text-gray-500 text-sm">Database Paman, Kakek, atau Pengurus Asrama.</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-1 mt-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total</div>
                            <div className="text-xl font-bold text-gray-900 leading-none mt-0.5">{guardians?.length || 0}</div>
                        </div>
                        {uniqueRelationships.slice(0, 3).map((rel) => (
                            <div key={rel} className="px-4 py-2 border-r border-gray-100 last:border-0">
                                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider truncate max-w-[80px]">{rel}</div>
                                <div className="text-xl font-bold text-orange-600 leading-none mt-0.5">
                                    {guardians?.filter(g => g.relationship_to_student === rel).length || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Export Dropdown */}
                    <div className="relative flex-1 sm:flex-initial">
                        <Button
                            variant="outline"
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        >
                            <Download size={16} className="mr-2" />
                            Export
                            <ChevronDown size={16} className="ml-2" />
                        </Button>

                        {isExportOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsExportOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                                    <button
                                        onClick={handleExportExcel}
                                        disabled={exportExcelMutation.isPending}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FileSpreadsheet size={16} className="text-green-600" />
                                        Export Excel
                                        {exportExcelMutation.isPending && <span className="text-xs text-gray-400 ml-auto">...</span>}
                                    </button>
                                    <div className="border-t border-gray-50"></div>
                                    <button
                                        onClick={handleExportPDF}
                                        disabled={exportPDFMutation.isPending}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <FileText size={16} className="text-red-600" />
                                        Export PDF
                                        {exportPDFMutation.isPending && <span className="text-xs text-gray-400 ml-auto">...</span>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleCreate}
                        className="flex-1 sm:flex-initial bg-orange-600 hover:bg-orange-700"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tambah Wali
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
                                placeholder="Cari nama wali, NIK, email, atau telepon..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <select
                                value={relationshipFilter}
                                onChange={(e) => setRelationshipFilter(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white cursor-pointer min-w-40"
                            >
                                <option value="ALL">Semua Hubungan</option>
                                {uniqueRelationships.map((rel) => (
                                    <option key={rel} value={rel}>{rel}</option>
                                ))}
                            </select>
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {relationshipFilter !== 'ALL' && (
                            <Button
                                variant="outline"
                                onClick={() => setRelationshipFilter('ALL')}
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
                <div className="col-span-4">Nama Wali</div>
                <div className="col-span-2">Hubungan</div>
                <div className="col-span-3">Kontak</div>
                <div className="col-span-2">NIK</div>
                <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* Cards/Rows List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data...</p>
                </div>
            ) : filteredGuardians.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data wali.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredGuardians.map((guardian) => (
                        <GuardianCard
                            key={guardian.id}
                            guardian={guardian}
                            onViewDetail={handleViewDetail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}