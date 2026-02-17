import { useState } from 'react';
import { useAllViolations, useDeleteViolation } from '../violationQueries';
import { Search, Plus, FileText, AlertCircle } from 'lucide-react';
import { useAlertStore } from '../../../store/alertStore';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb';
import Button from '../../../components/ui/Button';
import { useDebounce } from '../../../hooks/useDebounce';
import ViolationCard from './ViolationCard';

const ViolationHistory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: violations, isLoading } = useAllViolations({ page, limit, q: debouncedSearch });
    const deleteMutation = useDeleteViolation();
    const { showAlert } = useAlertStore();

    const filteredViolations = violations?.items || [];

    const handleDelete = (id: string) => {
        showAlert(
            'Hapus Data Pelanggaran',
            'Apakah Anda yakin ingin menghapus data pelanggaran ini? Poin siswa akan dikembalikan.',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    const handleViewDetail = (id: string) => {
        navigate(`/dashboard/violations/${id}`);
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Pelanggaran Santri', icon: FileText }
                ]}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pelanggaran Santri</h1>
                    <p className="text-gray-500 text-sm">Kelola data pelanggaran santri</p>
                </div>
                <Link to="/dashboard/violations/record">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Catat Pelanggaran
                    </Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                <Search className="text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama santri atau jenis pelanggaran..."
                    className="flex-1 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <p className="mt-3 text-gray-500">Memuat data pelanggaran...</p>
                </div>
            ) : filteredViolations.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'Data tidak ditemukan' : 'Belum ada data pelanggaran'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Mulai dengan mencatat pelanggaran baru.'}
                    </p>
                    <Link to="/dashboard/violations/record">
                        <Button className="mx-auto">
                            <Plus className="w-4 h-4 mr-2" /> Catat Pelanggaran
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Header for Desktop */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">
                        <div className="col-span-2">TANGGAL</div>
                        <div className="col-span-2">SANTRI</div>
                        <div className="col-span-2">KATEGORI</div>
                        <div className="col-span-5">PELANGGARAN</div>
                        <div className="col-span-1 text-center">POIN</div>
                        {/* <div className="col-span-1 text-right">AKSI</div> */}
                    </div>

                    {filteredViolations.map((violation) => (
                        <ViolationCard
                            key={violation.id}
                            violation={violation}
                            onViewDetail={handleViewDetail}
                            onDelete={handleDelete}
                        />
                    ))}

                    {/* Pagination */}
                    {violations?.meta && violations.meta.total_pages > 1 && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                Menampilkan {filteredViolations.length} dari {violations.meta.total_items} data
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={violations.meta.current_page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="text-sm px-3 py-1 h-8"
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center text-sm font-medium text-gray-700 px-2">
                                    Page {violations.meta.current_page} of {violations.meta.total_pages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={violations.meta.current_page === violations.meta.total_pages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="text-sm px-3 py-1 h-8"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViolationHistory;
