import { useState } from 'react';
import { useViolationCategories, useViolationTypes, useCreateViolationType, useDeleteViolationType } from '../../violationQueries';
import { Trash2, Plus, X, List } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { useAlertStore } from '../../../../store/alertStore';

const TypeManager = () => {
    const { data: categories } = useViolationCategories();
    const { data: types, isLoading } = useViolationTypes();
    const createMutation = useCreateViolationType();
    const deleteMutation = useDeleteViolationType();
    const { showAlert } = useAlertStore();

    const [isAdding, setIsAdding] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !categoryId) return;

        await createMutation.mutateAsync({
            category_id: categoryId,
            name,
            description,
            default_points: Number(points)
        });

        // Reset fields but keep category for convenience
        setIsAdding(false);
        setName('');
        setDescription('');
        setPoints(0);
    };

    const handleDelete = (id: string) => {
        showAlert(
            'Hapus Jenis Pelanggaran',
            'Apakah Anda yakin menghapus jenis pelanggaran ini?',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Daftar Jenis Pelanggaran</h3>
                    <p className="text-sm text-gray-500">Detail pelanggaran dan poin</p>
                </div>
                <Button onClick={() => setIsAdding(true)} disabled={isAdding} variant="primary">
                    <Plus size={16} className="mr-2" />
                    Tambah Jenis
                </Button>
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Tambah Jenis Pelanggaran</h4>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white"
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    autoFocus
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Pelanggaran <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Terlambat > 15 menit"
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Poin Default</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        value={points}
                                        onChange={(e) => setPoints(Number(e.target.value))}
                                        min="0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="Keterangan tambahan..."
                                        className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                                Batal
                            </Button>
                            <Button type="submit" isLoading={createMutation.isPending} disabled={!categoryId || !name}>
                                Simpan Jenis
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-100 w-1/3">Nama Pelanggaran</th>
                            <th className="px-6 py-3 border-b border-gray-100">Kategori</th>
                            <th className="px-6 py-3 border-b border-gray-100 w-24 text-center">Poin</th>
                            <th className="px-6 py-3 border-b border-gray-100 text-right w-24">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : types?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <List size={24} />
                                        </div>
                                        <p>Belum ada jenis pelanggaran</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            types?.map((type) => (
                                <tr key={type.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{type.name}</div>
                                        {type.description && <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {categories?.find(c => c.id === type.category_id)?.name || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                            {type.default_points}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            title="Hapus Jenis"
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

export default TypeManager;
