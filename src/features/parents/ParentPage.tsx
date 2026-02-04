import { useState } from 'react';
import {Plus, Trash2, Search, Users, Eye} from 'lucide-react';
import { useParents, useDeleteParent } from './parentQueries';
import type { Parent } from './types';
import Button from '../../components/ui/Button';
import ParentFormModal from './ParentFormModal';
import ParentDetailModal from './ParentDetailModal';

export default function ParentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [parentToEdit, setParentToEdit] = useState<Parent | null>(null);

    const { data: parents, isLoading, isError } = useParents();
    const deleteMutation = useDeleteParent();

    const handleCreate = () => {
        setParentToEdit(null);
        setIsModalOpen(true);
    };

    const handleViewDetail = (id: string) => {
        setDetailId(id);
    };

    const handleEditFromDetail = (parent: Parent) => {
        setDetailId(null);
        setParentToEdit(parent);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Yakin hapus data ini?')) deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Data Orang Tua</h1>
                    <p className="text-gray-500 text-sm">Database orang tua dan wali siswa.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Data
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Cari nama..." className="pl-9 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"/>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* TABLE */}
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">Gender</th>
                            <th className="px-6 py-3">Kontak</th>
                            <th className="px-6 py-3">Pekerjaan</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {parents?.map((parent) => (
                            <tr key={parent.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <div>{parent.full_name}</div>
                                            <div className={`text - [10px] px - 1.5 py - 0.5 rounded inline - block mt - 0.5 ${ parent.life_status === 'alive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' } `}>
                                                {parent.life_status === 'alive' ? 'Hidup' : 'Meninggal'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {parent.gender === 'male' ? 'L' : parent.gender === 'female' ? 'P' : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span>{parent.phone_number || '-'}</span>
                                        <span className="text-xs text-gray-400">{parent.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{parent.occupation || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Tombol Mata */}
                                        <button onClick={() => handleViewDetail(parent.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                                            <Eye size={18} />
                                        </button>

                                        <button onClick={() => handleDelete(parent.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <ParentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                parentToEdit={parentToEdit}
            />

            <ParentDetailModal
                parentId={detailId}
                onClose={() => setDetailId(null)}
                onEdit={handleEditFromDetail}
            />
        </div>
    );
}