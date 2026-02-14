import { useState } from 'react';
import { BookOpen, UserCheck, Trash2, GraduationCap, AlertCircle } from 'lucide-react';
import { useAcademicYears } from '../academic-years/academicYearQueries';
import { useClassrooms } from '../classrooms/classroomQueries';
import { useAssignmentsByClass, useDeleteAssignment } from './assignmentQueries';
import { useAlertStore } from '../../../store/alertStore';
import AssignmentForm from './AssignmentForm';

export default function AssignmentPage() {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');

    // 1. Fetch Tahun Ajaran
    const { data: years } = useAcademicYears();

    // Auto select Active Year
    if (!selectedYear && years) {
        const active = years.find(y => y.status === 'ACTIVE');
        if (active) setSelectedYear(active.id);
        else if (years.length > 0) setSelectedYear(years[0].id);
    }

    // 2. Fetch Kelas berdasarkan Tahun Ajaran
    const { data: classrooms } = useClassrooms(selectedYear);

    // 3. Fetch Assignments jika kelas dipilih
    const { data: assignments, isLoading } = useAssignmentsByClass(selectedClassId);

    const deleteMutation = useDeleteAssignment(selectedClassId);
    const { showAlert } = useAlertStore();

    const handleDelete = (id: string) => {
        showAlert(
            'Konfirmasi Hapus',
            'Hapus guru pengampu ini?',
            'warning',
            () => deleteMutation.mutate(id),
            () => { }
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Guru Pengampu (Teaching Assignment)</h1>
                <p className="text-gray-500 text-sm">Atur siapa mengajar apa di kelas mana.</p>
            </div>

            {/* FILTER SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setSelectedClassId(''); // Reset kelas saat tahun ganti
                        }}
                    >
                        {years?.map(y => (
                            <option key={y.id} value={y.id}>{y.name} {y.status === 'ACTIVE' ? '(Aktif)' : ''}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
                    <select
                        className="w-full border-gray-300 rounded-lg p-2 text-sm border outline-none"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        disabled={!selectedYear}
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {classrooms?.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.level}-{c.major})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CONTENT SECTION */}
            {!selectedClassId ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Pilih Kelas Terlebih Dahulu</h3>
                    <p className="mt-1 text-sm text-gray-500">Silakan pilih kelas di atas untuk melihat dan mengatur guru pengampu.</p>
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Memuat data...</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Form Tambah */}
                    <AssignmentForm classroomId={selectedClassId} />

                    {/* Tabel Daftar */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Mata Pelajaran</th>
                                    <th className="px-6 py-3">Guru Pengampu</th>
                                    <th className="px-6 py-3">NIP / Info Guru</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {assignments?.map((item) => (
                                    <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={16} className="text-blue-500" />
                                                {item.subject.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <UserCheck size={16} className="text-green-600" />
                                                {item.teacher.user.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {item.teacher.nip}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                                title="Hapus Penugasan"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {assignments?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                                Belum ada guru yang ditugaskan di kelas ini.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}