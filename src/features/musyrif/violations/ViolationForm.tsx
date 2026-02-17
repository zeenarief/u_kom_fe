import { useState, useMemo, useEffect } from 'react';
import { useStudents } from '../../admin/students/studentQueries';
import { useViolationCategories, useViolationTypes } from '../violationQueries';
import { useDebounce } from '../../../hooks/useDebounce';
import { Search, Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import type { CreateViolationPayload, StudentViolation } from '../types';

interface ViolationFormProps {
    initialData?: StudentViolation;
    onSubmit: (data: CreateViolationPayload) => Promise<void>;
    isLoading?: boolean;
    isEdit?: boolean;
    resetOnSuccess?: boolean;
}

const ViolationForm = ({ initialData, onSubmit, isLoading = false, isEdit = false, resetOnSuccess = false }: ViolationFormProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [points, setPoints] = useState<number>(0);
    const [action, setAction] = useState('');
    const [notes, setNotes] = useState('');

    const { data: students, isLoading: isLoadingStudents } = useStudents({ q: debouncedSearch });
    const { data: categories } = useViolationCategories();
    const { data: types } = useViolationTypes();

    const filteredTypes = useMemo(() => {
        if (!selectedCategoryId || !types) return [];
        return types.filter(t => t.category_id === selectedCategoryId);
    }, [selectedCategoryId, types]);

    // Initialize Form with Data
    useEffect(() => {
        if (initialData && isEdit) {
            setSelectedStudentId(initialData.student_id);
            setDate(new Date(initialData.violation_date).toISOString().split('T')[0]);
            setPoints(initialData.points);
            setAction(initialData.action_taken || '');
            setNotes(initialData.notes || '');

            if (types) {
                // Try to find type by name if ID is missing or match by ID if available (assuming StudentViolation has violation_type_id in future, currently inferred)
                // For now, let's look for matching name
                const type = types.find(t => t.name === initialData.violation_name);
                if (type) {
                    setSelectedTypeId(type.id);
                    setSelectedCategoryId(type.category_id);
                }
            }
        }
    }, [initialData, isEdit, types]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const typeId = e.target.value;
        setSelectedTypeId(typeId);
        const type = types?.find(t => t.id === typeId);
        if (type) {
            setPoints(type.default_points);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStudentId || !selectedTypeId || !date) {
            toast.error('Mohon lengkapi data wajib');
            return;
        }

        const payload: CreateViolationPayload = {
            student_id: selectedStudentId,
            violation_type_id: selectedTypeId,
            violation_date: new Date(date).toISOString(),
            points: Number(points),
            action_taken: action,
            notes: notes
        };

        await onSubmit(payload);

        if (resetOnSuccess) {
            setSelectedStudentId('');
            setSearchTerm('');
            setAction('');
            setNotes('');
            // Optional: Keep Category, Type and Date for faster input
        }
    };

    // Find selected student name for display
    const selectedStudentName = useMemo(() => {
        if (isEdit && initialData && initialData.student_id === selectedStudentId) {
            return initialData.student_name;
        }
        return students?.items.find(s => s.id === selectedStudentId)?.full_name;
    }, [students, selectedStudentId, initialData, isEdit]);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 border-b border-gray-100 pb-6">
                <label className="block text-sm font-medium text-gray-700">Cari & Pilih Santri</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Ketik nama santri..."
                        className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isEdit} // Disable changing student on edit for simplicity
                    />
                </div>

                {searchTerm && !isEdit && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                        {isLoadingStudents ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Memuat...</div>
                        ) : students?.items.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Santri tidak ditemukan</div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {students?.items.map(student => (
                                    <div
                                        key={student.id}
                                        onClick={() => {
                                            setSelectedStudentId(student.id);
                                            setSearchTerm('');
                                        }}
                                        className={`p-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center ${selectedStudentId === student.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    >
                                        <div className="font-medium">{student.full_name}</div>
                                        {selectedStudentId === student.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedStudentId && (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex justify-between items-center">
                        <span>Santri terpilih: <strong>{selectedStudentName}</strong></span>
                        {!isEdit && (
                            <button type="button" onClick={() => { setSelectedStudentId(''); setSearchTerm(''); }} className="text-xs underline text-blue-600">
                                Ganti
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pelanggaran</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setSelectedTypeId('');
                        }}
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories?.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pelanggaran</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        value={selectedTypeId}
                        onChange={handleTypeChange}
                        disabled={!selectedCategoryId}
                    >
                        <option value="">-- Pilih Jenis --</option>
                        {filteredTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.name} (Poin: {t.default_points})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kejadian</label>
                    <input
                        type="date"
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poin Pelanggaran</label>
                    <input
                        type="number"
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none bg-gray-50"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        min="0"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan / Hukuman (Opsional)</label>
                    <textarea
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        rows={2}
                        placeholder="Contoh: Sangsi ringan..."
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                    <textarea
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        rows={2}
                        placeholder="Kronologi..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" isLoading={isLoading} disabled={!selectedStudentId || !selectedTypeId}>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? 'Simpan Perubahan' : 'Catat Pelanggaran'}
                </Button>
            </div>
        </form>
    );
};

export default ViolationForm;
