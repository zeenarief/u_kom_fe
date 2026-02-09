import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Download, Search, Briefcase, Filter, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useEmployees, useDeleteEmployee } from './employeeQueries';
import { useAlertStore } from '../../store/alertStore';
import Button from '../../components/ui/Button';
import EmployeeCard from './EmployeeCard';
import { useDebounce } from '../../hooks/useDebounce';

export default function EmployeePage() {
    const navigate = useNavigate();
    // const exportMutation = useExportEmployees();
    // const exportPDFMutation = useExportEmployeesPDF();

    // Export Dropdown State
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const { data: employees, isLoading, isError } = useEmployees(debouncedSearch);
    const deleteMutation = useDeleteEmployee();

    // Filter employees berdasarkan employment status
    const filteredEmployees = employees?.filter(employee => {
        const matchesStatus = statusFilter === 'ALL' || employee.employment_status === statusFilter;
        return matchesStatus;
    }) || [];

    const handleCreate = () => {
        navigate('/dashboard/employees/create');
    };

    const handleViewDetail = (id: string) => {
        navigate(`/dashboard/employees/${id}`);
    };

    const { showAlert } = useAlertStore();
    const handleDelete = (id: string) => {
        showAlert(
            'Konfirmasi Hapus',
            'Yakin hapus data pegawai ini?',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    const handleExport = () => {
        // exportMutation.mutate();
        console.log('Export Excel - to be implemented');
    };

    const handleExportPDF = () => {
        // exportPDFMutation.mutate();
        console.log('Export PDF - to be implemented');
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                            <Briefcase className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Data Guru & Tendik</h1>
                            <p className="text-gray-500 text-sm">Manajemen data pegawai sekolah.</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-1 mt-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total</div>
                            <div className="text-xl font-bold text-gray-900 leading-none mt-0.5">{employees?.length || 0}</div>
                        </div>
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">PNS</div>
                            <div className="text-xl font-bold text-green-600 leading-none mt-0.5">
                                {employees?.filter(e => e.employment_status === 'PNS').length || 0}
                            </div>
                        </div>
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Honorer</div>
                            <div className="text-xl font-bold text-yellow-600 leading-none mt-0.5">
                                {employees?.filter(e => e.employment_status === 'Honorer').length || 0}
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Tetap</div>
                            <div className="text-xl font-bold text-blue-600 leading-none mt-0.5">
                                {employees?.filter(e => e.employment_status === 'Tetap').length || 0}
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
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                        Export Excel
                                    </button>
                                    <div className="border-t border-gray-50"></div>
                                    <button
                                        onClick={() => {
                                            handleExportPDF();
                                            setIsExportOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-red-600" />
                                        Export PDF
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <Button onClick={handleCreate} className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Pegawai
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
                                placeholder="Cari nama, NIP, atau jabatan..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white cursor-pointer min-w-32"
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="PNS">PNS</option>
                                <option value="Honorer">Honorer</option>
                                <option value="Tetap">Tetap</option>
                                <option value="Kontrak">Kontrak</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {statusFilter !== 'ALL' && (
                            <Button
                                variant="outline"
                                onClick={() => setStatusFilter('ALL')}
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
                <div className="col-span-3">IDENTITAS PEGAWAI</div>
                <div className="col-span-2">JABATAN</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-2">KONTAK</div>
                <div className="col-span-2 text-center">AKUN</div>
                <div className="col-span-1 text-right">AKSI</div>
            </div>

            {/* CONTENT: Employee Cards */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data pegawai...</p>
                </div>
            ) : (
                <>
                    {filteredEmployees.length > 0 ? (
                        <div className="space-y-3">
                            {filteredEmployees.map((employee) => (
                                <EmployeeCard
                                    key={employee.id}
                                    employee={employee}
                                    onViewDetail={handleViewDetail}
                                    onDelete={handleDelete}
                                />
                            ))}

                            {/* Result Count */}
                            <div className="text-sm text-gray-500 pt-2">
                                Menampilkan {filteredEmployees.length} dari {employees?.length || 0} pegawai
                                {statusFilter !== 'ALL' && (
                                    <span className="ml-2">
                                        (difilter berdasarkan status: {statusFilter})
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Briefcase className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search || statusFilter !== 'ALL'
                                    ? 'Pegawai tidak ditemukan'
                                    : 'Belum ada data pegawai'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {search || statusFilter !== 'ALL'
                                    ? 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan.'
                                    : 'Mulai dengan menambahkan pegawai baru ke dalam sistem.'}
                            </p>
                            <Button onClick={handleCreate} className="mx-auto">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Pegawai Pertama
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}