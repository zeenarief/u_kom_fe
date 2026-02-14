import { useState } from 'react';
import { Users, Plus, Trash2, Save, Search } from 'lucide-react';
import { useParents } from '../parents/parentQueries';
import { useSyncStudentParents } from './studentQueries';
import type { Student } from './types';
import type { Parent } from '../parents/types';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

interface FamilyManagerProps {
    student: Student;
}

// Interface lokal untuk state form
interface ParentRow {
    parent_id: string;
    relationship_type: string;
    parent_name: string; // Untuk display saja
}

export default function FamilyManager({ student }: FamilyManagerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // State data keluarga (inisialisasi dari props student)
    const [familyList, setFamilyList] = useState<ParentRow[]>(
        student.parents?.map(p => ({
            parent_id: p.parent_info.id,
            relationship_type: p.relationship_type,
            parent_name: p.parent_info.full_name
        })) || []
    );

    const syncMutation = useSyncStudentParents();
    const { data: allParents } = useParents(); // Ambil semua data parent (untuk search)
    const [searchQuery, setSearchQuery] = useState('');

    // Handle Tambah Parent dari Modal Search
    const handleAddParent = (parent: Parent) => {
        // Cek duplikat
        if (familyList.some(f => f.parent_id === parent.id)) {
            alert('Orang tua ini sudah ada di list.');
            return;
        }

        setFamilyList(prev => [
            ...prev,
            {
                parent_id: parent.id,
                relationship_type: 'FATHER', // Default
                parent_name: parent.full_name
            }
        ]);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Handle Hapus Baris
    const handleRemove = (index: number) => {
        const newList = [...familyList];
        newList.splice(index, 1);
        setFamilyList(newList);
    };

    // Handle Ganti Tipe Hubungan (Ayah/Ibu)
    const handleChangeRelation = (index: number, type: string) => {
        const newList = [...familyList];
        newList[index].relationship_type = type;
        setFamilyList(newList);
    };

    // Handle Simpan ke Server
    const handleSave = () => {
        const payload = {
            parents: familyList.map(item => ({
                parent_id: item.parent_id,
                relationship_type: item.relationship_type
            }))
        };

        syncMutation.mutate(
            { studentId: student.id, data: payload },
            { onSuccess: () => setIsEditing(false) }
        );
    };

    // Filter Search
    const filteredParents = allParents?.filter(p =>
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit 5 hasil aja biar rapi

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                    <Users size={18} className="text-blue-500" /> Data Keluarga
                </h3>
                {!isEditing ? (
                    <Button variant="ghost" onClick={() => setIsEditing(true)}>
                        Edit Keluarga
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Batal</Button>
                        <Button onClick={handleSave} isLoading={syncMutation.isPending}>
                            <Save size={14} className="mr-1" /> Simpan
                        </Button>
                    </div>
                )}
            </div>

            {/* VIEW MODE: Tampilan Read Only */}
            {!isEditing && (
                <div className="space-y-3">
                    {student.parents && student.parents.length > 0 ? (
                        student.parents.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        {p.relationship_type === 'FATHER' ? 'AYAH' : p.relationship_type === 'MOTHER' ? 'IBU' : 'WALI'}
                                    </span>
                                    <p className="font-medium text-gray-900">{p.parent_info.full_name}</p>
                                </div>
                                {/* Bisa tambah tombol info parent detail di sini nanti */}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">Belum ada data keluarga.</p>
                    )}
                </div>
            )}

            {/* EDIT MODE: Form Edit */}
            {isEditing && (
                <div className="space-y-3">
                    {familyList.map((item, index) => (
                        <div key={item.parent_id} className="flex gap-2 items-center bg-blue-50 p-2 rounded-lg">
                            {/* Dropdown Relasi */}
                            <select
                                className="text-sm border-gray-300 rounded p-1.5 outline-none font-semibold text-blue-800 bg-white border"
                                value={item.relationship_type}
                                onChange={(e) => handleChangeRelation(index, e.target.value)}
                            >
                                <option value="FATHER">AYAH</option>
                                <option value="MOTHER">IBU</option>
                                <option value="GUARDIAN">WALI</option>
                            </select>

                            {/* Nama Orang Tua (Readonly di sini) */}
                            <div className="flex-1 text-sm font-medium text-gray-700 truncate px-2">
                                {item.parent_name}
                            </div>

                            {/* Tombol Hapus */}
                            <button onClick={() => handleRemove(index)} className="text-red-500 hover:bg-red-100 p-1.5 rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {/* Tombol Tambah Baris */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Tambah Anggota Keluarga
                    </button>
                </div>
            )}

            {/* MODAL SEARCH PARENT */}
            <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Cari Data Orang Tua">
                <div className="h-[400px] flex flex-col">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            autoFocus
                            type="text"
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ketik nama orang tua..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                        {searchQuery.length > 0 && filteredParents?.map(parent => (
                            <button
                                key={parent.id}
                                onClick={() => handleAddParent(parent)}
                                className="w-full text-left p-3 hover:bg-blue-50 border-b border-gray-100 flex justify-between items-center group transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 group-hover:text-blue-700">{parent.full_name}</p>
                                    <p className="text-xs text-gray-500">{parent.phone_number || 'No Phone'}</p>
                                </div>
                                <Plus size={16} className="text-gray-300 group-hover:text-blue-600" />
                            </button>
                        ))}
                        {searchQuery.length > 0 && filteredParents?.length === 0 && (
                            <p className="text-center text-gray-400 mt-4">Data tidak ditemukan.</p>
                        )}
                        {searchQuery.length === 0 && (
                            <p className="text-center text-gray-400 mt-4 text-sm">Ketik nama untuk mencari...</p>
                        )}
                    </div>
                </div>
            </Modal>

        </div>
    );
}