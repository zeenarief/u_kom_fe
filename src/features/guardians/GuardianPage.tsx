import { useState } from 'react';
import { Plus, Trash2, Search, Shield, Eye } from 'lucide-react'; // Ganti Pencil dengan Eye
import { useGuardians, useDeleteGuardian } from './guardianQueries';
import type { Guardian } from './types';
import Button from '../../components/ui/Button';
import GuardianFormModal from './GuardianFormModal';
import GuardianDetailModal from './GuardianDetailModal'; // Import Detail Modal

import { useDebounce } from '../../hooks/useDebounce';

export default function GuardianPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [detailId, setDetailId] = useState<string | null>(null); // State untuk Detail ID
    const [guardianToEdit, setGuardianToEdit] = useState<Guardian | null>(null);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data: guardians, isLoading, isError } = useGuardians(debouncedSearch);
    const deleteMutation = useDeleteGuardian();

    // Buka Form Create
    const handleCreate = () => {
        setGuardianToEdit(null);
        setIsFormOpen(true);
    };

    // Buka Detail (Klik Mata)
    const handleViewDetail = (id: string) => {
        setDetailId(id);
    };

    // Callback dari Detail Modal -> Form Edit
    const handleEditFromDetail = (g: Guardian) => {
        setDetailId(null); // Tutup detail
        setGuardianToEdit(g); // Set data edit
        setIsFormOpen(true); // Buka form
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin ingin menghapus data wali ini?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Wali Lainnya</h1>
                    <p className="text-gray-500 text-sm">Database Paman, Kakek, atau Pengurus Asrama.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Wali
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama wali..."
                            className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">Hubungan</th>
                            <th className="px-6 py-3">Kontak</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guardians?.map((g) => (
                            <tr key={g.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Shield size={16} />
                                        </div>
                                        {g.full_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold uppercase">
                                        {g.relationship_to_student || 'Wali'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{g.phone_number}</div>
                                    <div className="text-xs text-gray-400">{g.email}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Tombol Mata (Detail) */}
                                        <button
                                            onClick={() => handleViewDetail(g.id)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                            title="Lihat Detail"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {/* Tombol Hapus */}
                                        <button
                                            onClick={() => handleDelete(g.id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded"
                                            title="Hapus Data"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {guardians?.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-400">Belum ada data wali.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL 1: Form Create/Edit */}
            <GuardianFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                guardianToEdit={guardianToEdit}
            />

            {/* MODAL 2: Detail Viewer */}
            <GuardianDetailModal
                guardianId={detailId}
                onClose={() => setDetailId(null)}
                onEdit={handleEditFromDetail}
            />
        </div>
    );
}