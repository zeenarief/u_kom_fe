import { useState, useMemo } from 'react';
import { useStudents } from '../../admin/students/studentQueries';
import { useViolationCategories, useViolationTypes, useCreateViolation } from '../violationQueries';
import { useDebounce } from '../../../hooks/useDebounce';
import { Search, Save, AlertCircle, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import Breadcrumb from '../../../components/common/Breadcrumb';

const ViolationInputForm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Form State
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [points, setPoints] = useState<number>(0);
    const [action, setAction] = useState('');
    const [notes, setNotes] = useState('');

    // Queries
    const { data: students, isLoading: isLoadingStudents } = useStudents(debouncedSearch);
    const { data: categories } = useViolationCategories();
    const { data: types } = useViolationTypes();
    const createMutation = useCreateViolation();

    // Derived State
    const filteredTypes = useMemo(() => {
        if (!selectedCategoryId || !types) return [];
        return types.filter(t => t.category_id === selectedCategoryId);
    }, [selectedCategoryId, types]);

    const selectedStudent = useMemo(() => {
        return students?.find(s => s.id === selectedStudentId);
    }, [students, selectedStudentId]);

    // Handlers
    const handleTypeChange = (typeId: string) => {
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

        try {
            await createMutation.mutateAsync({
                student_id: selectedStudentId,
                violation_type_id: selectedTypeId,
                violation_date: new Date(date).toISOString(),
                points: Number(points),
                action_taken: action,
                notes: notes
            });

            // Reset Form (maintain category/date maybe?)
            setSelectedStudentId('');
            // setSelectedCategoryId(''); // Optional: keep category
            // setSelectedTypeId('');
            setAction('');
            setNotes('');
            setSearchTerm(''); // Clear search to reset student list view
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Pelanggaran Santri', href: '/dashboard/violations/history', icon: FileText },
                    { label: 'Input Pelanggaran', icon: AlertCircle }
                ]}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-red-500" />
                    Input Pelanggaran Santri
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Pilih Santri */}
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
                            />
                        </div>

                        {/* Student Selection List */}
                        {searchTerm && (
                            <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                                {isLoadingStudents ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">Memuat...</div>
                                ) : students?.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">Santri tidak ditemukan</div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {students?.map(student => (
                                            <div
                                                key={student.id}
                                                onClick={() => {
                                                    setSelectedStudentId(student.id);
                                                    setSearchTerm(student.full_name); // Set search term to selected name
                                                }}
                                                className={`p-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center ${selectedStudentId === student.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                            >
                                                <div>
                                                    <div className="font-medium">{student.full_name}</div>
                                                    <div className="text-xs text-gray-500">{student.nisn || student.nim || '-'}</div>
                                                </div>
                                                {selectedStudentId === student.id && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedStudentId && !searchTerm && (
                            <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex justify-between items-center">
                                <span>Santri terpilih: <strong>{selectedStudent?.full_name}</strong></span>
                                <button type="button" onClick={() => { setSelectedStudentId(''); setSearchTerm(''); }} className="text-xs underline text-blue-600">Ganti</button>
                            </div>
                        )}
                    </div>

                    {/* 2. Detail Pelanggaran */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pelanggaran</label>
                            <select
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    setSelectedCategoryId(e.target.value);
                                    setSelectedTypeId('');
                                    setPoints(0);
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
                                onChange={(e) => handleTypeChange(e.target.value)}
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

                    {/* 3. Tindakan & Catatan */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan / Hukuman (Opsional)</label>
                            <textarea
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                rows={2}
                                placeholder="Contoh: Membersihkan halaman asrama, Hafalan surat..."
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan (Opsional)</label>
                            <textarea
                                className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                                rows={2}
                                placeholder="Kronologi singkat atau catatan lain..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" isLoading={createMutation.isPending} disabled={!selectedStudentId || !selectedTypeId}>
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Pelanggaran
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ViolationInputForm;
