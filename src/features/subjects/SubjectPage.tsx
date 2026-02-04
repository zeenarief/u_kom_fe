import { useState } from 'react';
import { Plus, Trash2, Edit, BookOpen, Search } from 'lucide-react';
import { useSubjects, useDeleteSubject } from './subjectQueries';
import type { Subject } from './types';
import Button from '../../components/ui/Button';
import SubjectFormModal from './SubjectFormModal';

import { useDebounce } from '../../hooks/useDebounce';

export default function SubjectPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<Subject | null>(null);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data: subjects, isLoading, isError } = useSubjects(debouncedSearch);
    const deleteMutation = useDeleteSubject();

    const handleCreate = () => {
        setEditData(null);
        setIsFormOpen(true);
    };

    const handleEdit = (item: Subject) => {
        setEditData(item);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin hapus mata pelajaran ini?')) deleteMutation.mutate(id);
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mata Pelajaran</h1>
                    <p className="text-gray-500 text-sm">Daftar semua mata pelajaran dalam kurikulum.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari kode, nama, atau jenis..."
                            className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Kode</th>
                                <th className="px-6 py-3">Nama Mapel</th>
                                <th className="px-6 py-3">Kelompok</th>
                                <th className="px-6 py-3">Deskripsi</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">Loading data...</td>
                                </tr>
                            )}
                            {subjects?.map((item) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                                        {item.code}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={16} className="text-gray-400" />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.type || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                                        {item.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {subjects?.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Data tidak ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SubjectFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                dataToEdit={editData}
            />
        </div>
    );
}