import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Download, Search, Users, Filter, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useStudents, useDeleteStudent, useExportStudents, useExportStudentsPDF } from './studentQueries';
import { useAlertStore } from '../../../store/alertStore';
import Button from '../../../components/ui/Button';
import StudentCard from './StudentCard';
import { useDebounce } from '../../../hooks/useDebounce';

export default function StudentPage() {
    const navigate = useNavigate();
    const exportMutation = useExportStudents();
    const exportPDFMutation = useExportStudentsPDF();

    // Export Dropdown State
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Filter State
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [genderFilter, setGenderFilter] = useState<string>('ALL');

    const { data: students, isLoading, isError } = useStudents(debouncedSearch);
    const deleteMutation = useDeleteStudent();

    // Filter students berdasarkan status dan gender
    const filteredStudents = students?.filter(student => {
        const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;
        const matchesGender = genderFilter === 'ALL' || student.gender === genderFilter;
        return matchesStatus && matchesGender;
    }) || [];

    // 1. Buka Form Create
    const handleCreate = () => {
        navigate('/dashboard/students/create');
    };

    // 2. Buka Detail (Klik Mata / Card)
    const handleViewDetail = (id: string) => {
        navigate(`/dashboard/students/${id}`);
    };

    const { showAlert } = useAlertStore();
    const handleDelete = (id: string) => {
        showAlert(
            'Konfirmasi Hapus',
            'Yakin hapus data siswa ini?',
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
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
                            <p className="text-gray-500 text-sm">Manajemen data induk siswa lengkap.</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-1 mt-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total</div>
                            <div className="text-xl font-bold text-gray-900 leading-none mt-0.5">{students?.length || 0}</div>
                        </div>
                        <div className="px-4 py-2 border-r border-gray-100 last:border-0">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Aktif</div>
                            <div className="text-xl font-bold text-green-600 leading-none mt-0.5">
                                {students?.filter(s => s.status === 'ACTIVE').length || 0}
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Lulus</div>
                            <div className="text-xl font-bold text-blue-600 leading-none mt-0.5">
                                {students?.filter(s => s.status === 'GRADUATED').length || 0}
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

                    <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
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
                                placeholder="Cari nama, NISN, NIM, email, atau kota..."
                                className="pl-10 pr-4 py-2.5 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer min-w-32"
                            >
                                <option value="ALL">Semua Status</option>
                                <option value="INACTIVE">Tidak Aktif</option>
                                <option value="ACTIVE">Aktif</option>
                                <option value="GRADUATED">Lulus</option>
                                <option value="DROPOUT">Dropout</option>
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
                                className="appearance-none pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white cursor-pointer min-w-32"
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

                        {(statusFilter !== 'ALL' || genderFilter !== 'ALL') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStatusFilter('ALL');
                                    setGenderFilter('ALL');
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
                <div className="col-span-3">IDENTITAS SISWA</div>
                <div className="col-span-2">NISN & NIM</div>
                <div className="col-span-2">KELAS</div>
                <div className="col-span-2">ALAMAT</div>
                <div className="col-span-2 text-center">STATUS</div>
                <div className="col-span-1 text-right">AKSI</div>
            </div>

            {/* CONTENT: Student Cards/Table */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data siswa...</p>
                </div>
            ) : (
                <>
                    {filteredStudents.length > 0 ? (
                        <div className="space-y-3">
                            {filteredStudents.map((student) => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    onViewDetail={handleViewDetail}
                                    onDelete={handleDelete}
                                />
                            ))}

                            {/* Result Count */}
                            <div className="text-sm text-gray-500 pt-2">
                                Menampilkan {filteredStudents.length} dari {students?.length || 0} siswa
                                {(statusFilter !== 'ALL' || genderFilter !== 'ALL') && (
                                    <span className="ml-2">
                                        (difilter berdasarkan
                                        {statusFilter !== 'ALL' && ` status: ${statusFilter}`}
                                        {statusFilter !== 'ALL' && genderFilter !== 'ALL' && ' dan '}
                                        {genderFilter !== 'ALL' && ` gender: ${genderFilter === 'male' ? 'Laki-laki' : 'Perempuan'}`})
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {search || statusFilter !== 'ALL' || genderFilter !== 'ALL'
                                    ? 'Siswa tidak ditemukan'
                                    : 'Belum ada data siswa'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {search || statusFilter !== 'ALL' || genderFilter !== 'ALL'
                                    ? 'Coba ubah kata kunci pencarian atau filter yang Anda gunakan.'
                                    : 'Mulai dengan menambahkan siswa baru ke dalam sistem.'}
                            </p>
                            <Button onClick={handleCreate} className="mx-auto">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Siswa Pertama
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}