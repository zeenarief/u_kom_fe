import { useState, useMemo } from 'react';
import {
    useViolationCategories, useViolationTypes,
    useCreateViolationType, useUpdateViolationType, useDeleteViolationType,
    useCreateViolationCategory, useUpdateViolationCategory, useDeleteViolationCategory
} from '../../violationQueries';
import { Trash2, Plus, X, Edit, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { useAlertStore } from '../../../../store/alertStore';

const TypeManager = () => {
    // Queries & Mutations
    const { data: categories, isLoading: isLoadingCategories } = useViolationCategories();
    const { data: types, isLoading: isLoadingTypes } = useViolationTypes();

    const createTypeMutation = useCreateViolationType();
    const updateTypeMutation = useUpdateViolationType();
    const deleteTypeMutation = useDeleteViolationType();

    const createCategoryMutation = useCreateViolationCategory();
    const updateCategoryMutation = useUpdateViolationCategory();
    const deleteCategoryMutation = useDeleteViolationCategory();

    const { showAlert } = useAlertStore();
    const isLoading = isLoadingCategories || isLoadingTypes;

    // --- Type Form State ---
    const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
    const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
    const [typeCategoryId, setTypeCategoryId] = useState('');
    const [typeName, setTypeName] = useState('');
    const [typeDescription, setTypeDescription] = useState('');
    const [typePoints, setTypePoints] = useState(0);

    // --- Category Form State ---
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    // --- Accordion State ---
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // --- Computed ---
    const groupedTypes = useMemo(() => {
        if (!types || !categories) return {};
        const groups: Record<string, typeof types> = {};
        categories.forEach(cat => {
            groups[cat.id] = types.filter(t => t.category_id === cat.id);
        });
        return groups;
    }, [types, categories]);

    // --- Handlers: Accordion ---
    const toggleCategory = (id: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedCategories(newExpanded);
    };

    // --- Handlers: Category ---
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName) return;

        if (editingCategoryId) {
            await updateCategoryMutation.mutateAsync({
                id: editingCategoryId,
                data: { name: categoryName, description: categoryDescription }
            });
        } else {
            await createCategoryMutation.mutateAsync({
                name: categoryName,
                description: categoryDescription
            });
        }
        resetCategoryForm();
    };

    const handleEditCategory = (e: React.MouseEvent, category: any) => {
        e.stopPropagation();
        setEditingCategoryId(category.id);
        setCategoryName(category.name);
        setCategoryDescription(category.description || '');
        setIsCategoryFormOpen(true);
    };

    const handleDeleteCategory = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        showAlert(
            'Hapus Kategori',
            'Apakah Anda yakin? Semua jenis pelanggaran dalam kategori ini juga akan terhapus.',
            'warning',
            () => deleteCategoryMutation.mutate(id),
            () => { }
        );
    };

    const resetCategoryForm = () => {
        setIsCategoryFormOpen(false);
        setEditingCategoryId(null);
        setCategoryName('');
        setCategoryDescription('');
    };

    // --- Handlers: Type ---
    const handleTypeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!typeName || !typeCategoryId) return;

        const payload = {
            category_id: typeCategoryId,
            name: typeName,
            description: typeDescription,
            default_points: Number(typePoints)
        };

        if (editingTypeId) {
            await updateTypeMutation.mutateAsync({ id: editingTypeId, data: payload });
        } else {
            await createTypeMutation.mutateAsync(payload);
        }
        resetTypeForm();
    };

    const handleAddType = (preSelectedCategoryId?: string) => {
        setTypeCategoryId(preSelectedCategoryId || '');
        setIsTypeFormOpen(true);
        // Ensure the category is expanded if we add to it directly
        if (preSelectedCategoryId) {
            setExpandedCategories(new Set(expandedCategories).add(preSelectedCategoryId));
        }
    };

    const handleEditType = (type: any) => {
        setEditingTypeId(type.id);
        setTypeCategoryId(type.category_id);
        setTypeName(type.name);
        setTypeDescription(type.description || '');
        setTypePoints(type.default_points);
        setIsTypeFormOpen(true);
    };

    const handleDeleteType = (id: string) => {
        showAlert(
            'Hapus Jenis Pelanggaran',
            'Yakin hapus jenis pelanggaran ini?',
            'warning',
            () => deleteTypeMutation.mutate(id),
            () => { }
        );
    };

    const resetTypeForm = () => {
        setIsTypeFormOpen(false);
        setEditingTypeId(null);
        setTypeCategoryId('');
        setTypeName('');
        setTypeDescription('');
        setTypePoints(0);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Data Pelanggaran</h3>
                    <p className="text-sm text-gray-500">Kelola kategori dan jenis pelanggaran</p>
                </div>
                <Button onClick={() => setIsCategoryFormOpen(true)} variant="primary">
                    <FolderPlus size={16} className="mr-2" />
                    Tambah Kategori
                </Button>
            </div>

            {/* Category Form Modal (Inline) */}
            {isCategoryFormOpen && (
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-blue-900">{editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h4>
                        <button onClick={resetCategoryForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleCategorySubmit}>
                        <div className="grid gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Kategori <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Kedisiplinan, Kerapihan"
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Penjelasan singkat..."
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={resetCategoryForm}>Batal</Button>
                            <Button type="submit" isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                                {editingCategoryId ? 'Simpan' : 'Buat Kategori'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Type Form Modal (Inline) */}
            {isTypeFormOpen && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">{editingTypeId ? 'Edit Jenis Pelanggaran' : 'Tambah Jenis Pelanggaran'}</h4>
                        <button onClick={resetTypeForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleTypeSubmit}>
                        <div className="grid gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                    value={typeCategoryId}
                                    onChange={e => setTypeCategoryId(e.target.value)}
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
                                    className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Poin Default</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                        value={typePoints}
                                        onChange={(e) => setTypePoints(Number(e.target.value))}
                                        min="0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                        value={typeDescription}
                                        onChange={(e) => setTypeDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={resetTypeForm}>Batal</Button>
                            <Button type="submit" isLoading={createTypeMutation.isPending || updateTypeMutation.isPending}>
                                {editingTypeId ? 'Simpan' : 'Buat Jenis'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Memuat data...</div>
                ) : categories?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <FolderPlus size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium">Belum ada Kategori</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4">Mulai dengan membuat kategori pelanggaran baru.</p>
                        <Button onClick={() => setIsCategoryFormOpen(true)} variant="primary">
                            Buat Kategori Baru
                        </Button>
                    </div>
                ) : (
                    categories?.map((category) => {
                        const categoryTypes = groupedTypes[category.id] || [];
                        const isExpanded = expandedCategories.has(category.id);

                        return (
                            <div key={category.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                                <div
                                    className="px-5 py-4 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50/80 transition-colors"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
                                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-base">{category.name}</h4>
                                            {category.description && <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>}
                                        </div>
                                        <span className="ml-2 text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                                            {categoryTypes.length} Jenis
                                        </span>
                                    </div>

                                    {/* Category Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddType(category.id);
                                            }}
                                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors mr-2"
                                        >
                                            <Plus size={14} />
                                            Tambah Jenis
                                        </button>
                                        <div className="flex items-center border-l border-gray-200 pl-2 gap-1">
                                            <button
                                                onClick={(e) => handleEditCategory(e, category)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit Kategori"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteCategory(e, category.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/30">
                                        {categoryTypes.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <p className="text-gray-500 text-sm mb-3">Belum ada jenis pelanggaran di kategori ini.</p>
                                                <Button variant="outline" onClick={() => handleAddType(category.id)}>
                                                    <Plus size={14} className="mr-2" />
                                                    Tambah Jenis Pelanggaran
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                                        <tr>
                                                            <th className="px-6 py-3 pl-14 w-1/2">Jenis Pelanggaran</th>
                                                            <th className="px-6 py-3 w-32 text-center">Poin</th>
                                                            <th className="px-6 py-3 text-right">Aksi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {categoryTypes.map((type) => (
                                                            <tr key={type.id} className="hover:bg-white transition-colors group">
                                                                <td className="px-6 py-3 pl-14">
                                                                    <div className="font-medium text-gray-900">{type.name}</div>
                                                                    {type.description && <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>}
                                                                </td>
                                                                <td className="px-6 py-3 text-center">
                                                                    <span className="font-bold text-gray-700 bg-gray-200/60 px-2 py-1 rounded text-xs">
                                                                        {type.default_points}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-3 text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                                        <button
                                                                            onClick={() => handleEditType(type)}
                                                                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-all"
                                                                            title="Edit Jenis"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteType(type.id)}
                                                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                                            title="Hapus Jenis"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TypeManager;
