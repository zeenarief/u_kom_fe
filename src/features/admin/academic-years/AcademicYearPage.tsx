import { useState } from 'react';
import { Plus, Trash2, Edit, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useAcademicYears, useDeleteAcademicYear, useActivateAcademicYear } from './academicYearQueries';
import { useAlertStore } from '../../../store/alertStore';
import type { AcademicYear } from './types';
import Button from '../../../components/ui/Button';
import AcademicYearFormModal from './AcademicYearFormModal';

export default function AcademicYearPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<AcademicYear | null>(null);

    const { data: years, isLoading, isError } = useAcademicYears();
    const deleteMutation = useDeleteAcademicYear();
    const activateMutation = useActivateAcademicYear();
    const { showAlert } = useAlertStore();

    const handleCreate = () => {
        setEditData(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: AcademicYear) => {
        setEditData(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        showAlert(
            'Konfirmasi Hapus',
            'Yakin hapus tahun ajaran ini?',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    const handleActivate = (id: string) => {
        showAlert(
            'Konfirmasi Aktivasi',
            'Aktifkan tahun ajaran ini? Tahun ajaran lain akan otomatis non-aktif.',
            'warning',
            () => activateMutation.mutate(id),
            () => { }
        );
    };

    // Helper format tanggal indonesia
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tahun Ajaran</h1>
                    <p className="text-gray-500 text-sm">Atur periode akademik sekolah.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Baru
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama Periode</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Durasi</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years?.map((item) => (
                            <tr key={item.id} className={`border-b transition-colors ${item.status === 'ACTIVE' ? 'bg-green-50/50' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <Calendar size={20} />
                                        </div>
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.status === 'ACTIVE' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle2 size={14} className="mr-1" /> Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <XCircle size={14} className="mr-1" /> Non-Aktif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-900">{formatDate(item.start_date)}</div>
                                    <div className="text-xs text-gray-500">s/d {formatDate(item.end_date)}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Tombol Activate (Hanya jika belum aktif) */}
                                        {item.status !== 'ACTIVE' && (
                                            <Button
                                                variant="outline"
                                                className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
                                                onClick={() => handleActivate(item.id)}
                                                isLoading={activateMutation.isPending && activateMutation.variables === item.id}
                                            >
                                                Aktifkan
                                            </Button>
                                        )}

                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={item.status === 'ACTIVE'} // Cegah hapus tahun aktif
                                            title={item.status === 'ACTIVE' ? "Tidak bisa menghapus tahun aktif" : "Hapus"}
                                        >
                                            <Trash2 size={18} className={item.status === 'ACTIVE' ? 'opacity-50' : ''} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {years?.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-400">Belum ada data tahun ajaran.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AcademicYearFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                dataToEdit={editData}
            />
        </div>
    );
}