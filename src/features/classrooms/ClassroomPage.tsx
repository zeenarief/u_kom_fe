import { useState } from 'react';
import { useAcademicYears } from '../academic-years/academicYearQueries';
import { useClassrooms, useDeleteClassroom } from './classroomQueries';
import type { Classroom } from './types';

import Button from '../../components/ui/Button';
import { Plus, Edit, Trash2, Users, GraduationCap } from 'lucide-react';
import ClassroomFormModal from './ClassroomFormModal';
import ClassroomStudentsModal from './ClassroomStudentsModal';

export default function ClassroomPage() {
    const [selectedYear, setSelectedYear] = useState<string>('');

    // Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<Classroom | null>(null);
    const [manageStudentsId, setManageStudentsId] = useState<string | null>(null);

    // 1. Fetch Tahun Ajaran dulu
    const { data: years, isLoading: loadingYears } = useAcademicYears();

    // Set default tahun ajaran ke yang ACTIVE jika belum dipilih
    if (!selectedYear && years) {
        const active = years.find(y => y.status === 'ACTIVE');
        if (active) setSelectedYear(active.id);
        else if (years.length > 0) setSelectedYear(years[0].id);
    }

    // 2. Fetch Classroom berdasarkan tahun ajaran yang dipilih
    const { data: classrooms, isLoading: loadingClasses } = useClassrooms(selectedYear);
    const deleteMutation = useDeleteClassroom();

    const handleEdit = (c: Classroom) => {
        setEditData(c);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditData(null);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus kelas ini? Data history siswa di kelas ini juga akan terhapus.')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Kelas (Rombel)</h1>
                    <p className="text-gray-500 text-sm">Manajemen kelas dan anggota.</p>
                </div>

                <div className="flex gap-2">
                    {/* Dropdown Filter Tahun Ajaran */}
                    <select
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        disabled={loadingYears}
                    >
                        {loadingYears && <option>Loading...</option>}
                        {years?.map(y => (
                            <option key={y.id} value={y.id}>
                                {y.name} {y.status === 'ACTIVE' ? '(Aktif)' : ''}
                            </option>
                        ))}
                    </select>

                    <Button onClick={handleCreate} disabled={!selectedYear}>
                        <Plus className="w-4 h-4 mr-2" /> Buat Kelas
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingClasses ? (
                    <p>Loading classes...</p>
                ) : classrooms?.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                        Belum ada kelas di tahun ajaran ini.
                    </div>
                ) : (
                    classrooms?.map(c => (
                        <div key={c.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{c.name}</h3>
                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                        Kelas {c.level} - {c.major}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={16} className="text-gray-400" />
                                    <span>Wali: {c.homeroom_teacher_name || 'Belum diset'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-gray-400" />
                                    <span>{c.total_students} Siswa</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full text-sm"
                                onClick={() => setManageStudentsId(c.id)}
                            >
                                <Users size={16} className="mr-2" /> Kelola Anggota
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <ClassroomFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                dataToEdit={editData}
                academicYearId={selectedYear}
            />

            <ClassroomStudentsModal
                classroomId={manageStudentsId}
                onClose={() => setManageStudentsId(null)}
            />
        </div>
    );
}