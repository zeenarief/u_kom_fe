import { useState } from 'react';
import { Plus, Trash2, Search, GraduationCap, Eye, Download, Printer } from 'lucide-react'; // Ganti Pencil dengan Eye
import { useStudents, useDeleteStudent, useExportStudents, useExportStudentsPDF } from './studentQueries';
import type { Student } from './types';
import Button from '../../components/ui/Button';
import StudentFormModal from './StudentFormModal';
import StudentDetailModal from './StudentDetailModal';

import { useDebounce } from '../../hooks/useDebounce';


export default function StudentPage() {
    const exportMutation = useExportStudents();
    const exportPDFMutation = useExportStudentsPDF();

    // State Modal Form (Create/Edit)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

    // State Modal Detail
    const [detailId, setDetailId] = useState<string | null>(null);

    // Search State
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const { data: students, isLoading, isError } = useStudents(debouncedSearch);
    const deleteMutation = useDeleteStudent();

    // 1. Buka Form Create
    const handleCreate = () => {
        setStudentToEdit(null);
        setIsFormOpen(true);
    };

    // 2. Buka Detail (Klik Mata)
    const handleViewDetail = (id: string) => {
        setDetailId(id);
    };

    // 3. Callback dari Detail -> Edit (Klik tombol Edit di dalam detail)
    const handleEditFromDetail = (student: Student) => {
        setDetailId(null); // Tutup modal detail
        setStudentToEdit(student); // Set data edit
        setIsFormOpen(true); // Buka modal form
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin hapus data siswa ini?')) deleteMutation.mutate(id);
    };

    const handleExport = () => {
        exportMutation.mutate();
    };

    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
                    <p className="text-gray-500 text-sm">Manajemen data induk siswa lengkap.</p>
                </div>
                <div className="flex gap-2">
                    {/* TOMBOL PDF */}
                    <Button
                        variant="outline"
                        onClick={() => exportPDFMutation.mutate()}
                        isLoading={exportPDFMutation.isPending}
                        className="bg-white border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Export PDF
                    </Button>
                    {/* TOMBOL EXPORT */}
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        isLoading={exportMutation.isPending}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4 mr-2" /> Export Excel
                    </Button>

                    <Button onClick={handleCreate}>
                        <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama, NISN, atau Kota..."
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
                                <th className="px-6 py-3">Identitas Siswa</th>
                                <th className="px-6 py-3">NIM</th>
                                <th className="px-6 py-3">L/P</th>
                                <th className="px-6 py-3">Kota Asal</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">Loading data...</td>
                                </tr>
                            )}
                            {students?.map((student) => (
                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <GraduationCap size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{student.full_name}</div>
                                                <div className="text-xs text-gray-500">NISN: {student.nisn || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600">
                                        {student.nim || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.gender === 'male' ? 'L' : 'P'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Tampilkan City, jika kosong strip */}
                                        {student.city || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Tombol Detail (Mata) */}
                                            <button
                                                onClick={() => handleViewDetail(student.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Lihat Detail Lengkap"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Data"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students?.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Belum ada data siswa.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: Form Create/Edit */}
            <StudentFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                studentToEdit={studentToEdit}
            />

            {/* MODAL 2: Detail Viewer */}
            <StudentDetailModal
                studentId={detailId}
                onClose={() => setDetailId(null)}
                onEdit={handleEditFromDetail}
            />
        </div>
    );
}