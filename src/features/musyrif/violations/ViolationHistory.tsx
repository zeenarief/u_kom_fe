import { useState } from 'react';
import { useAllViolations, useDeleteViolation } from '../violationQueries';
import { Search, Trash2, Calendar, Plus, FileText } from 'lucide-react';
import { useAlertStore } from '../../../store/alertStore';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb';
import Button from '../../../components/ui/Button';
import { useDebounce } from '../../../hooks/useDebounce';

const ViolationHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: violations, isLoading } = useAllViolations({ page, limit, q: debouncedSearch });
    const deleteMutation = useDeleteViolation();
    const { showAlert } = useAlertStore();

    // Use items from paginated response
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Santri</th>
                                <th className="px-6 py-3">Pelanggaran</th>
                                <th className="px-6 py-3">Poin</th>
                                <th className="px-6 py-3">Tindakan</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">Loading...</td>
                                </tr>
                            ) : filteredViolations?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">Belum ada data pelanggaran</td>
                                </tr>
                            ) : (
                                filteredViolations?.map((v) => (
                                    <tr key={v.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(v.violation_date).toLocaleDateString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {v.student_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5">
                                                {v.violation_name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded border border-red-200">
                                                +{v.points}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                                            {v.action_taken || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(v.id)}
                                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {violations?.meta && violations.meta.total_pages > 1 && (
                <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-gray-500">
                        Menampilkan {filteredViolations.length} dari {violations.meta.total_items} data
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={violations.meta.current_page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="text-sm"
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
                            className="text-sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationHistory;
