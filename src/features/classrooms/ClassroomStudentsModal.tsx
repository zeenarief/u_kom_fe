import { useState } from 'react';
import { Search, Trash2, UserPlus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { useClassroomDetail, useAddStudentsToClass, useRemoveStudentFromClass } from './classroomQueries';
import { useAlertStore } from '../../store/alertStore';
import { useStudents } from '../students/studentQueries';

interface Props {
    classroomId: string | null;
    onClose: () => void;
}

export default function ClassroomStudentsModal({ classroomId, onClose }: Props) {
    const { data: classroom, isLoading } = useClassroomDetail(classroomId);
    const { data: allStudents } = useStudents();

    const addMutation = useAddStudentsToClass(classroomId || '');
    const removeMutation = useRemoveStudentFromClass(classroomId || '');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // Safe access untuk filtering
    const currentStudents = classroom?.students || [];

    const availableStudents = allStudents?.filter(s => {
        const isAlreadyInClass = currentStudents.some(member => member.id === s.id);
        const matchesSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.nisn && s.nisn.includes(searchTerm));
        return !isAlreadyInClass && matchesSearch;
    }).slice(0, 5);

    const handleAdd = () => {
        if (selectedStudentId) {
            addMutation.mutate([selectedStudentId], {
                onSuccess: () => {
                    setSelectedStudentId('');
                    setSearchTerm('');
                }
            });
        }
    };

    const { showAlert } = useAlertStore();

    const handleRemove = (studentId: string) => {
        showAlert(
            'Konfirmasi',
            'Keluarkan siswa ini dari kelas?',
            'warning',
            () => removeMutation.mutate(studentId),
            () => { }
        );
    };

    if (!classroomId) return null;

    return (
        <Modal isOpen={!!classroomId} onClose={onClose} title={`Anggota Kelas: ${classroom?.name || '...'}`}>
            <div className="space-y-6 h-[500px] flex flex-col">

                {/* 1. Form Tambah Siswa */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                        <UserPlus size={16} /> Tambah Siswa ke Kelas
                    </h4>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Cari nama siswa / NISN..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {searchTerm && (
                        <div className="bg-white border rounded-lg shadow-sm max-h-40 overflow-y-auto">
                            {availableStudents?.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStudentId(s.id)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex justify-between ${selectedStudentId === s.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                >
                                    <span>{s.full_name}</span>
                                    <span className="text-gray-400 text-xs">{s.nisn}</span>
                                </button>
                            ))}
                            {availableStudents?.length === 0 && <p className="p-2 text-xs text-gray-400 text-center">Tidak ditemukan</p>}
                        </div>
                    )}

                    <Button
                        className="w-full"
                        disabled={!selectedStudentId || addMutation.isPending}
                        onClick={handleAdd}
                        isLoading={addMutation.isPending}
                    >
                        Tambahkan Siswa
                    </Button>
                </div>

                {/* 2. Daftar Siswa di Kelas */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold text-gray-700">
                            Daftar Siswa ({classroom?.students ? classroom.students.length : 0})
                        </h4>
                    </div>

                    <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50">
                        {isLoading ? (
                            <p className="p-4 text-center text-gray-400">Loading...</p>
                        ) : (!classroom?.students || classroom.students.length === 0) ? (
                            <p className="p-8 text-center text-gray-400 italic">Belum ada siswa di kelas ini.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nama</th>
                                        <th className="px-4 py-2 text-left">NISN</th>
                                        <th className="px-4 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {classroom.students.map(s => (
                                        <tr key={s.id} className="bg-white">
                                            <td className="px-4 py-2 font-medium">{s.full_name}</td>
                                            <td className="px-4 py-2 text-gray-500">{s.nisn || '-'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleRemove(s.id)}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                    title="Keluarkan"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2 border-t">
                    <Button variant="ghost" onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </Modal>
    );
}