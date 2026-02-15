import { useState } from 'react';
import { useViolationCategories, useCreateViolationCategory, useDeleteViolationCategory } from '../../violationQueries';
import { Trash2, Plus, X, List } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { useAlertStore } from '../../../../store/alertStore';

const CategoryManager = () => {
    const { data: categories, isLoading } = useViolationCategories();
    const createMutation = useCreateViolationCategory();
    const deleteMutation = useDeleteViolationCategory();
    const { showAlert } = useAlertStore();

    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        await createMutation.mutateAsync({ name, description });
        setIsAdding(false);
        setName('');
        setDescription('');
    };

    const handleDelete = (id: string) => {
        showAlert(
            'Hapus Kategori',
            'Apakah Anda yakin? Jenis pelanggaran di dalam kategori ini juga akan terhapus.',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Daftar Kategori</h3>
                    <p className="text-sm text-gray-500">Kategori utama pelanggaran</p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding} variant="primary">
                    <Plus size={16} className="mr-2" />
                    Tambah Kategori
                </Button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Tambah Kategori Baru</h4>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Kedisiplinan, Kerapihan"
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Penjelasan singkat kategori ini"
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                                Batal
                            </Button>
                            <Button type="submit" isLoading={createMutation.isPending}>
                                Simpan Kategori
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-100 w-1/3">Nama Kategori</th>
                            <th className="px-6 py-3 border-b border-gray-100">Deskripsi</th>
                            <th className="px-6 py-3 border-b border-gray-100 text-right w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : categories?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <List size={24} />
                                        </div>
                                        <p>Belum ada kategori pelanggaran</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            categories?.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{cat.description || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            title="Hapus Kategori"
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
    );
};

export default CategoryManager;
