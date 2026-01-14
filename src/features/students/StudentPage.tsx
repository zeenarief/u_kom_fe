import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Plus, Trash2, Search, GraduationCap } from 'lucide-react';
import { useStudents, useCreateStudent, useDeleteStudent } from './studentQueries';
import type {StudentCreateRequest} from '../../types/api';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function StudentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Queries
    const { data: students, isLoading, isError } = useStudents();
    const createMutation = useCreateStudent(() => setIsModalOpen(false));
    const deleteMutation = useDeleteStudent();

    // Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<StudentCreateRequest>();

    const onSubmit: SubmitHandler<StudentCreateRequest> = (data) => {
        const payload = { ...data};
        if (payload.date_of_birth) {
            payload.date_of_birth = `${payload.date_of_birth}T00:00:00Z`;
        }
        if (!payload.nisn) delete payload.nisn;
        if (!payload.nim) delete payload.nim;
        createMutation.mutate(payload);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin hapus data siswa ini?')) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="p-8 text-center">Loading data siswa...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
                    <p className="text-gray-500 text-sm">Manajemen data induk siswa.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Siswa
                </Button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NISN..."
                            className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">NISN / NIM</th>
                            <th className="px-6 py-3">L/P</th>
                            <th className="px-6 py-3">Kota Asal</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students?.map((student) => (
                            <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                            <GraduationCap size={16} />
                                        </div>
                                        {student.full_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-mono">{student.nisn || '-'}</span>
                                        <span className="text-xs text-gray-400">{student.nim}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {student.gender === 'male' ? 'L' : student.gender === 'female' ? 'P' : '-'}
                                </td>
                                <td className="px-6 py-4">{student.city || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                                        <Trash2 size={16}/>
                                    </button>
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

            {/* MODAL FORM CREATE */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Siswa Baru">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Nama Lengkap"
                        placeholder="Nama Siswa"
                        error={errors.full_name?.message}
                        {...register('full_name', { required: 'Nama wajib diisi' })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="NISN"
                            placeholder="00123..."
                            {...register('nisn')}
                        />
                        <Input
                            label="NIM"
                            placeholder="2024..."
                            {...register('nim')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                            <select
                                {...register('gender')}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">- Pilih -</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                        <Input
                            label="Tanggal Lahir"
                            type="date"
                            {...register('date_of_birth')}
                        />
                    </div>

                    <Input
                        label="Alamat / Kota"
                        placeholder="Alamat singkat..."
                        {...register('address')}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit" isLoading={createMutation.isPending}>Simpan</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}